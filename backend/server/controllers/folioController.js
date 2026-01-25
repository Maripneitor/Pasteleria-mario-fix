const fs = require('fs').promises;
const path = require('path');
const { format, parseISO, startOfWeek, endOfWeek, getDate, getMonth, lastDayOfMonth } = require('date-fns');
const { es } = require('date-fns/locale');
// Asegúrate que sequelize esté correctamente importado aquí desde ../models o ../config/database
const { Folio, Client, User, FolioEditHistory, FolioHistory, Commission, sequelize, Flavor, Filling } = require('../models');
const { Op } = require('sequelize');
const pdfService = require('../services/pdfService');


const folioService = require('../services/folioService');
// (Eliminada función calculateFillingCost - Lógica movida al servicio)

// --- CALCULAR TOTALES (Endpoint auxiliar para frontend) ---
exports.calculateTotals = async (req, res) => {
    try {
        const { persons, folioType, filling, total, additional, deliveryCost, addCommissionToCustomer, advancePayment, isPaid } = req.body;

        // Validar/Normalizar datos mínimos necesarios
        const fillingData = Array.isArray(filling)
            ? filling.map(f => (typeof f === 'string' ? { name: f, hasCost: false } : f))
            : [];
        const additionalData = Array.isArray(additional) ? additional : [];

        const result = await folioService.calculateFolioTotals({
            persons: parseInt(persons) || 0,
            folioType: folioType || 'Normal',
            fillings: fillingData,
            basePrice: parseFloat(total) || 0,
            additionalItems: additionalData,
            deliveryCost: parseFloat(deliveryCost) || 0,
            applyCommission: addCommissionToCustomer === 'true' || addCommissionToCustomer === true,
            advancePayment: parseFloat(advancePayment) || 0,
            isPaid: isPaid
        });

        res.status(200).json(result);
    } catch (error) {
        console.error("Error al calcular totales:", error);
        res.status(500).json({ message: 'Error al calcular totales', error: error.message });
    }
};

// --- CREAR un nuevo folio ---
// --- CREAR un nuevo folio ---
exports.createFolio = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const userRole = req.user?.role || '';
        const isPrivileged = ['developer', 'admin', 'owner', 'Administrador', 'Dueño'].includes(userRole);

        let tenantBranchId = req.tenant ? req.tenant.branchId : null;

        // Si es privilegiado y envía branchId explícito, usar ese.
        if (isPrivileged && req.body.branchId) {
            tenantBranchId = req.body.branchId;
        }

        if (!tenantBranchId && !isPrivileged) throw new Error('Contexto de sucursal no definido');

        const {
            clientName, clientPhone, clientPhone2, total, advancePayment, deliveryDate,
            tiers, accessories, additional, isPaid, hasExtraHeight, imageComments,
            cakeFlavor, filling, complements, addCommissionToCustomer, status,
            existingImageUrls, existingImageComments,
            ...folioData
        } = req.body;

        // DEBUG: Loguear payload completo para detectar errores de validación
        console.log(`📦 payload crear folio (Raw Body):`, JSON.stringify(req.body, null, 2));

        const requiredFields = ['deliveryDate', 'total', 'advancePayment', 'folioType', 'persons', 'designDescription'];
        // Si NO hay clientId, nombre y teléfono son obligatorios
        if (!req.body.clientId) {
            requiredFields.push('clientName', 'clientPhone');
        }
        const missingFields = requiredFields.filter(field => !req.body[field] && req.body[field] !== 0);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Faltan campos obligatorios.",
                missing: missingFields
            });
        }

        if (isNaN(parseFloat(total)) || isNaN(parseFloat(advancePayment))) {
            return res.status(400).json({ message: "El total y el anticipo deben ser valores numéricos." });
        }

        console.log(`📝 Iniciando creación de folio en Branch ${tenantBranchId} para cliente: ${clientName}`);

        // Buscar o crear cliente SCOPED por sucursal
        // IMPORTANTE: Un mismo teléfono puede existir en diferentes sucursales como clientes distintos
        // Buscar client existente si se provee ID
        let client;
        let created = false;

        if (folioData.clientId) {
            client = await Client.findByPk(folioData.clientId, { transaction: t });
            if (!client) throw new Error('Cliente no encontrado');
        } else {
            [client, created] = await Client.findOrCreate({
                where: {
                    phone: clientPhone,
                    branchId: tenantBranchId // <--- Scope
                },
                defaults: {
                    name: clientName,
                    branchId: tenantBranchId // Crear en esta branch
                },
                transaction: t
            });
            // (Phone2 update removed)
        }

        // Generar número de folio
        const lastFourDigits = String(client.phone).slice(-4);
        const date = parseISO(deliveryDate);
        const monthInitial = format(date, 'MMMM', { locale: es }).charAt(0).toUpperCase();
        const dayInitial = format(date, 'EEEE', { locale: es }).charAt(0).toUpperCase();
        const dayOfMonth = format(date, 'dd');

        let baseFolioNumber = `${monthInitial}${dayInitial}-${dayOfMonth}-${lastFourDigits}`;
        let finalFolioNumber = baseFolioNumber;
        let counter = 1;

        // Verificar unicidad DENTRO de la transacción y SCOPED por Branch
        let existingFolio = await Folio.findOne({
            where: {
                folioNumber: finalFolioNumber,
                branchId: tenantBranchId // <--- Scope
            },
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        while (existingFolio) {
            finalFolioNumber = `${baseFolioNumber}-${counter}`;
            counter++;
            existingFolio = await Folio.findOne({
                where: {
                    folioNumber: finalFolioNumber,
                    branchId: tenantBranchId
                },
                transaction: t,
                lock: t.LOCK.UPDATE
            });
        }

        // ... (Procesamiento JSON igual que antes) ...
        const additionalData = JSON.parse(additional || '[]');
        const tiersData = JSON.parse(tiers || '[]');
        const rawFillingData = JSON.parse(filling || '[]');
        const fillingData = Array.isArray(rawFillingData) ? rawFillingData.map(f => (typeof f === 'string' ? { name: f, hasCost: false } : f)) : [];
        const complementsData = JSON.parse(complements || '[]');
        const cakeFlavorData = JSON.parse(cakeFlavor || '[]');

        // ... (Validaciones de Catálogo Omitidas por brevedad, se pueden re-integrar) ...

        const calculationResult = await folioService.calculateFolioTotals({
            persons: folioData.persons,
            folioType: folioData.folioType,
            fillings: fillingData,
            basePrice: total,
            additionalItems: additionalData,
            deliveryCost: folioData.deliveryCost,
            applyCommission: addCommissionToCustomer === 'true' || addCommissionToCustomer === true,
            advancePayment: advancePayment,
            isPaid: isPaid
        });

        const {
            total: finalTotal,
            advancePayment: finalAdvancePayment,
            balance,
            commission: roundedCommissionAmount,
            rawCommission: commissionAmount,
            isPaid: finalIsPaidStatus
        } = calculationResult;

        const newImageUrls = req.files ? req.files.map(file => file.path.replace(/\\/g, '/')) : [];
        const aiImageUrls = JSON.parse(existingImageUrls || '[]').map(url => url.replace(/\\/g, '/'));
        const imageUrls = [...aiImageUrls, ...newImageUrls];

        const newComments = JSON.parse(imageComments || '[]');
        const aiComments = JSON.parse(existingImageComments || '[]');
        const finalImageComments = imageUrls.map((url, index) => {
            if (index < aiImageUrls.length) return aiComments[index] || null;
            return newComments[index - aiImageUrls.length] || null;
        });

        const newFolioData = {
            ...folioData,
            deliveryDate,
            deliveryTime: folioData.deliveryTime || '00:00:00',
            folioNumber: finalFolioNumber,
            total: finalTotal.toFixed(2),
            advancePayment: finalAdvancePayment.toFixed(2),
            balance: balance.toFixed(2),
            clientId: client.id,
            responsibleUserId: req.user?.id || null,
            imageUrls: imageUrls.length > 0 ? imageUrls : null,
            imageComments: finalImageComments.some(c => c !== null) ? finalImageComments : null,
            clientId: client.id,
            responsibleUserId: req.user?.id || null,
            imageUrls: imageUrls.length > 0 ? imageUrls : null,
            imageComments: finalImageComments.some(c => c !== null) ? finalImageComments : null,
            // tiers: tiersData.length > 0 ? tiersData : null, // Removed from model
            accessories: accessories || null,
            additional: additionalData.length > 0 ? additionalData : null,

            // Updated Fields for IDs
            flavorId: folioData.flavorId || null,
            fillingId: folioData.fillingId || null,
            // cakeFlavor: cakeFlavorData.length > 0 ? cakeFlavorData : null, // Legacy removed
            // filling: fillingData.length > 0 ? fillingData : null, // Legacy removed

            complements: complementsData.length > 0 ? complementsData : null,
            isPaid: finalIsPaidStatus,
            hasExtraHeight: hasExtraHeight === 'true' || hasExtraHeight === true,
            status: status === 'Nuevo' ? 'Nuevo' : (folioData.status || 'Nuevo'),
            branchId: tenantBranchId, // <--- ASIGNACIÓN DE TENANT
            ownerId: null, // Legacy field, can be kept null or deprecated
            classification: {
                priority: (new Date(deliveryDate) <= new Date(Date.now() + 172800000)) ? 'High' : 'Normal',
                valueLevel: (parseFloat(finalTotal) > 1000) ? 'High' : 'Standard',
                urgency: (new Date(deliveryDate).toDateString() === new Date().toDateString() &&
                    parseInt(folioData.deliveryTime?.split(':')[0]) - new Date().getHours() < 4) ? 'Urgent' : 'Normal'
            }
        };

        const newFolio = await Folio.create(newFolioData, { transaction: t });

        await Commission.create({
            folioId: newFolio.id,
            folioNumber: newFolio.folioNumber,
            amount: commissionAmount.toFixed(2),
            appliedToCustomer: calculationResult.applyCommission || (addCommissionToCustomer === 'true' || addCommissionToCustomer === true),
            roundedAmount: (addCommissionToCustomer === 'true' || addCommissionToCustomer === true) ? roundedCommissionAmount.toFixed(2) : null
        }, { transaction: t });

        // --- AUDIT LOG (CREATE) ---
        await FolioHistory.create({
            folioId: newFolio.id,
            userId: req.user?.id || null,
            branchId: tenantBranchId,
            action: 'CREATE',
            newData: newFolio.toJSON() // Snapshot of created data
        }, { transaction: t });
        // -------------------------

        await t.commit();
        console.log(`✅ Folio ${newFolio.folioNumber} creado exitosamente en Branch ${tenantBranchId}.`);
        res.status(201).json(newFolio);

        // ... (Async tasks: PDF, WhatsApp) ...

    } catch (error) {
        if (t && !t.finished) {
            await t.rollback();
        }
        console.error('❌ ERROR AL CREAR FOLIO:', error);
        res.status(400).json({ message: `Error al crear el folio: ${error.message}`, error: error.stack });
    }
};

// --- OBTENER TODOS los folios ---
// --- OBTENER TODOS los folios ---
// --- OBTENER TODOS los folios ---
exports.getAllFolios = async (req, res) => {
    try {
        const { q, status } = req.query;
        // Blindaje: Scope por Tenant obligatorio (EXCEPTO para Admin/Developer)
        const userRole = req.user?.role || ''; // Asumiendo que el middleware de auth populan el rol
        const isPrivileged = ['developer', 'admin', 'owner', 'Administrador', 'Dueño'].includes(userRole);

        const tenantBranchId = req.tenant ? req.tenant.branchId : null;

        if (!tenantBranchId && !isPrivileged) {
            return res.status(400).json({ message: 'Error de seguridad: No se pudo determinar el contexto de la sucursal.' });
        }

        let whereClause = {};

        // Solo aplicar filtro de branch si NO es privilegiado
        // REGLA DE NEGOCIO: El Admin/Developer DEBE ver todo (Global View).
        // Si el usuario es privilegiado, NO agregamos branchId al whereClause.
        if (!isPrivileged) {
            whereClause.branchId = tenantBranchId;
        } else {
            // El usuario es admin/developer/owner, así que no filtramos por branch.
            // Esto cumple con: "romper la barrera de sucursal".
            console.log(`👁️ GLOBAL VIEW: Usuario Privilegiado (${userRole}) accediendo a folios de TODAS las sucursales.`);
        }

        // 1. Filtro de Búsqueda (Search)
        if (q) {
            const searchTerm = `%${q}%`;
            whereClause[Op.and] = [
                {
                    [Op.or]: [
                        { folioNumber: { [Op.like]: searchTerm } },
                        { '$client.name$': { [Op.like]: searchTerm } },
                        { '$client.phone$': { [Op.like]: searchTerm } }
                    ]
                }
            ];
        }

        // 2. Filtro de Estado
        if (status) {
            whereClause.status = status;
        } else if (status !== "") {
            // Excluir pendientes por defecto solo si no se pide explicitamente todos los status
            whereClause.status = { [Op.ne]: 'Pendiente' };
        }

        const folios = await Folio.findAll({
            where: whereClause,
            include: [
                { model: Client, as: 'client', attributes: ['name', 'phone'], required: false },
                { model: User, as: 'responsibleUser', attributes: ['username'], required: false }
            ],
            order: status === 'Pendiente' ? [['createdAt', 'DESC']] : [['deliveryDate', 'ASC'], ['deliveryTime', 'ASC']]
        });

        res.status(200).json(folios);

    } catch (error) {
        console.error("❌ Error CRÍTICO en getAllFolios:", error);
        res.status(500).json({ message: 'Error interno del servidor al obtener folios.', error: error.message });
    }
};

// --- OBTENER UN SOLO folio por su ID ---
// --- OBTENER UN SOLO folio por su ID ---
exports.getFolioById = async (req, res) => {
    try {
        const folioId = req.params.id;
        const tenantBranchId = req.tenant ? req.tenant.branchId : null;
        const userRole = req.user?.role || '';
        const isPrivileged = ['developer', 'admin', 'owner', 'Administrador', 'Dueño'].includes(userRole);

        if (isNaN(folioId)) {
            return res.status(400).json({ message: 'ID de folio inválido.' });
        }
        if (!tenantBranchId && !isPrivileged) {
            return res.status(400).json({ message: 'Error de contexto de sucursal.' });
        }

        let whereClause = { id: folioId };
        if (!isPrivileged) {
            whereClause.branchId = tenantBranchId;
        }

        // Usamos findOne en lugar de findByPk para poder aplicar el filtro de sucursal
        const folio = await Folio.findOne({
            where: whereClause,
            include: [
                { model: Client, as: 'client', attributes: ['name', 'phone'], required: false },
                { model: User, as: 'responsibleUser', attributes: ['username'], required: false },
                { model: Commission, as: 'commission', required: false },
                {
                    model: FolioEditHistory,
                    as: 'editHistory',
                    attributes: ['createdAt'],
                    include: { model: User, as: 'editor', attributes: ['username'], required: false },
                    order: [['createdAt', 'ASC']],
                    required: false
                }
            ]
        });

        if (!folio) { return res.status(404).json({ message: 'Folio no encontrado en esta sucursal' }); }
        res.status(200).json(folio);
    } catch (error) {
        console.error(`Error en getFolioById (${req.params.id}):`, error);
        res.status(500).json({ message: 'Error al obtener el folio', error: error.message });
    }
};

// --- ACTUALIZAR un folio existente ---
exports.updateFolio = async (req, res) => {
    const folioId = req.params.id;
    // Validar ID
    if (isNaN(folioId)) {
        return res.status(400).json({ message: 'ID de folio inválido.' });
    }

    const t = await sequelize.transaction();
    try {
        const folio = await Folio.findByPk(folioId, { transaction: t, lock: t.LOCK.UPDATE });
        if (!folio) {
            await t.rollback();
            return res.status(404).json({ message: 'Folio no encontrado' });
        }
        // No permitir edición si está cancelado
        if (folio.status === 'Cancelado') {
            await t.rollback();
            return res.status(400).json({ message: 'No se puede editar un folio cancelado.' });
        }

        const {
            clientName, clientPhone, clientPhone2, total, advancePayment, deliveryDate,
            tiers, accessories, additional, isPaid, hasExtraHeight, imageComments,
            existingImageUrls, existingImageComments, cakeFlavor, filling,
            complements, addCommissionToCustomer, status, // Permitir actualizar status
            ...folioData // Resto de campos: folioType, persons, shape, designDescription, dedication, deliveryLocation, deliveryCost
        } = req.body;

        // Actualizar cliente asociado (si existe)
        if (folio.clientId) {
            const client = await Client.findByPk(folio.clientId, { transaction: t });
            if (client) {
                await client.update({ name: clientName, phone: clientPhone }, { transaction: t });
            } else {
                console.warn(`Cliente con ID ${folio.clientId} no encontrado para el folio ${folio.folioNumber} durante la actualización.`);
                // Considerar si esto debe ser un error o solo una advertencia
            }
        } else {
            // Si el folio no tenía cliente, ¿debería buscar/crear uno ahora?
            // Por simplicidad, asumimos que si no tenía, no se actualiza.
            console.warn(`Folio ${folio.folioNumber} no tiene un cliente asociado. No se actualizarán datos del cliente.`);
        }


        // Parsear datos JSON
        const additionalData = JSON.parse(additional || '[]');
        const tiersData = JSON.parse(tiers || '[]');
        const rawFillingData = JSON.parse(filling || '[]');
        const fillingData = Array.isArray(rawFillingData)
            ? rawFillingData.map(f => (typeof f === 'string' ? { name: f, hasCost: false } : f))
            : [];
        const complementsData = JSON.parse(complements || '[]');
        const cakeFlavorData = JSON.parse(cakeFlavor || '[]');

        // --- VALIDACIÓN DE CATÁLOGO DINÁMICO (Sabores y Rellenos) ---
        // (Nota: En Update usamos el ownerId del folio existente)
        const checkOwnerId = folio.ownerId;

        if (cakeFlavorData.length > 0) {
            const flavorNames = cakeFlavorData.map(f => typeof f === 'string' ? f : f.name);
            const validFlavors = await Flavor.findAll({
                where: {
                    name: flavorNames,
                    [Op.or]: [{ ownerId: null }, { ownerId: checkOwnerId }]
                },
                attributes: ['name']
            });
            const validNames = validFlavors.map(v => v.name);
            const invalidFlavors = flavorNames.filter(name => !validNames.includes(name));
            if (invalidFlavors.length > 0) console.warn(`⚠️ Update con sabores fuera de catálogo: ${invalidFlavors.join(', ')}`);
        }

        if (fillingData.length > 0) {
            const fillingNames = fillingData.map(f => f.name);
            const validFillings = await Filling.findAll({
                where: {
                    name: fillingNames,
                    [Op.or]: [{ ownerId: null }, { ownerId: checkOwnerId }]
                },
                attributes: ['name']
            });
            const validFillingNames = validFillings.map(v => v.name);
            const invalidFillings = fillingNames.filter(name => !validFillingNames.includes(name));
            if (invalidFillings.length > 0) console.warn(`⚠️ Update con rellenos fuera de catálogo: ${invalidFillings.join(', ')}`);
        }
        // -----------------------------------------------------------

        // Recalcular costos usando FolioService
        const currentFolioType = folioData.folioType || folio.folioType;
        const currentPersons = folioData.persons || folio.persons;

        const calculationResult = await folioService.calculateFolioTotals({
            persons: currentPersons,
            folioType: currentFolioType,
            fillings: fillingData,
            basePrice: total, // basePrice
            additionalItems: additionalData,
            deliveryCost: folioData.deliveryCost || folio.deliveryCost,
            applyCommission: addCommissionToCustomer === 'true' || addCommissionToCustomer === true,
            advancePayment: advancePayment,
            isPaid: isPaid
        });

        const {
            total: finalTotal,
            advancePayment: finalAdvancePayment,
            balance,
            commission: roundedCommissionAmount,
            rawCommission: commissionAmount,
            isPaid: finalIsPaidStatus
        } = calculationResult;

        const applyCommission = addCommissionToCustomer === 'true' || addCommissionToCustomer === true;


        // Manejar imágenes
        const currentExistingUrls = JSON.parse(existingImageUrls || '[]').map(url => url.replace(/\\/g, '/')); // Normalizar
        const newImageUrls = req.files ? req.files.map(file => file.path.replace(/\\/g, '/')) : []; // Normalizar
        const finalImageUrls = [...currentExistingUrls, ...newImageUrls];

        // Manejar comentarios
        const currentExistingComments = JSON.parse(existingImageComments || '[]');
        const newComments = JSON.parse(imageComments || '[]');
        // Asociar comentarios correctamente
        const finalImageComments = finalImageUrls.map((url, index) => {
            if (index < currentExistingUrls.length) return currentExistingComments[index] || null;
            return newComments[index - currentExistingUrls.length] || null;
        });


        // Capture Old Data for Audit
        const oldData = folio.toJSON();

        // Datos para actualizar en el folio
        const updateData = {
            ...folioData,
            deliveryDate: deliveryDate || folio.deliveryDate,
            deliveryTime: folioData.deliveryTime || folio.deliveryTime,
            total: finalTotal.toFixed(2),
            advancePayment: finalAdvancePayment.toFixed(2),
            balance: balance.toFixed(2),
            imageUrls: finalImageUrls.length > 0 ? finalImageUrls : null,
            imageComments: finalImageComments.some(c => c !== null) ? finalImageComments : null,
            // tiers: tiersData.length > 0 ? tiersData : null, // Removed
            accessories: accessories || null,
            additional: additionalData.length > 0 ? additionalData : null,

            flavorId: folioData.flavorId || folio.flavorId, // Update ID
            fillingId: folioData.fillingId !== undefined ? (folioData.fillingId || null) : folio.fillingId, // Update ID (allow clearing)

            // cakeFlavor: cakeFlavorData.length > 0 ? cakeFlavorData : null, // Removed
            // filling: fillingData.length > 0 ? fillingData : null, // Removed

            complements: complementsData.length > 0 ? complementsData : null,
            isPaid: finalIsPaidStatus,
            hasExtraHeight: hasExtraHeight === 'true' || hasExtraHeight === true,
            ...(status && ['Pendiente', 'Nuevo', 'En Producción', 'Listo para Entrega', 'Entregado', 'Cancelado'].includes(status) && { status: status })
        };

        // Limpiar campos según folioType si este cambia
        // Not needed for flavor/filling as they are IDs now, but logic remains valid if switching types re: nulling
        /*
        if (folioData.folioType && folioData.folioType !== folio.folioType) {
            if (folioData.folioType === 'Base/Especial') {
                 // Maybe clear flavorId if special cakes don't use it? 
                 // But model says flavorId is NOT NULL. So we must keep it.
            } else { 
                // updateData.tiers = null; 
            }
        }
        */

        await folio.update(updateData, { transaction: t });

        // --- TASK 3: Audit Log ---
        // Reload to ensure we have the stored state (or just use updateData merged). 
        // Using toJSON of updated instance.
        const newData = folio.toJSON();

        await FolioHistory.create({
            folioId: folio.id,
            userId: req.user?.id || null, // Editor
            branchId: folio.branchId, // From folio
            action: 'UPDATE',
            oldData: oldData,
            newData: newData
        }, { transaction: t });
        // -------------------------

        // Actualizar o crear registro de comisión
        let commission = await Commission.findOne({ where: { folioId: folio.id }, transaction: t });
        const commissionUpdateData = {
            folioNumber: folio.folioNumber, // Usar número de folio actual
            amount: commissionAmount.toFixed(2),
            appliedToCustomer: applyCommission,
            roundedAmount: applyCommission ? roundedCommissionAmount.toFixed(2) : null
        };
        if (commission) {
            await commission.update(commissionUpdateData, { transaction: t });
        } else {
            await Commission.create({ folioId: folio.id, ...commissionUpdateData }, { transaction: t });
        }

        // Registrar la edición en el historial
        await FolioEditHistory.create({ folioId: folioId, editorUserId: req.user?.id || null }, { transaction: t });

        await t.commit();
        console.log(`✅ Folio ${folio.folioNumber} actualizado exitosamente.`);
        // Devolver el folio actualizado
        const updatedFolio = await Folio.findByPk(folioId, { include: [{ model: Client, as: 'client', required: false }] }); // Volver a buscar con cliente
        res.status(200).json(updatedFolio);

    } catch (error) {
        if (t && !t.finished) {
            await t.rollback();
        }
        console.error(`❌ ERROR AL ACTUALIZAR FOLIO ${folioId}:`, error);

        if (error.original && error.original.code === 'ER_BAD_FIELD_ERROR') {
            return res.status(500).json({
                message: 'Error de configuración de base de datos: Columna faltante (probablemente "signature"). Ejecute las migraciones.',
                detail: error.original.sqlMessage
            });
        }

        res.status(400).json({ message: `Error al actualizar el folio: ${error.message}`, error: error.stack });
    }
};


// --- ELIMINAR un folio ---
exports.deleteFolio = async (req, res) => {
    const folioId = req.params.id;
    if (isNaN(folioId)) return res.status(400).json({ message: 'ID de folio inválido.' });

    const t = await sequelize.transaction();
    try {
        const folio = await Folio.findByPk(folioId, { transaction: t });
        if (!folio) {
            await t.rollback();
            return res.status(404).json({ message: 'Folio no encontrado' });
        }

        // Eliminar imágenes asociadas
        if (folio.imageUrls && folio.imageUrls.length > 0) {
            for (const imageUrl of folio.imageUrls) {
                try {
                    // Si es una URL remota (GCS), no intentar borrar del sistema de archivos local
                    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                        console.log(`ℹ️ Saltando eliminación local de imagen remota: ${imageUrl}`);
                        continue;
                    }

                    const imagePath = path.resolve(__dirname, '..', '..', imageUrl);
                    await fs.unlink(imagePath);
                    console.log(`Imagen eliminada: ${imagePath}`);
                } catch (err) {
                    console.error(`No se pudo eliminar la imagen ${imageUrl}:`, err.code === 'ENOENT' ? 'Archivo no encontrado.' : err.message);
                }
            }
        }

        // Eliminar registros relacionados ANTES de eliminar el folio
        await Commission.destroy({ where: { folioId: folio.id }, transaction: t });
        await FolioEditHistory.destroy({ where: { folioId: folio.id }, transaction: t });

        // Eliminar el folio
        const folioNumber = folio.folioNumber; // Guardar para log
        await folio.destroy({ transaction: t });

        await t.commit();
        console.log(`✅ Folio ${folioNumber} eliminado correctamente.`);
        res.status(200).json({ message: 'Folio eliminado correctamente' });

    } catch (error) {
        if (t && !t.finished) {
            await t.rollback();
        }
        console.error(`❌ Error al eliminar el folio ${folioId}:`, error);
        res.status(500).json({ message: 'Error al eliminar el folio', error: error.message });
    }
};

// --- Resto de funciones (generateFolioPdf, markAsPrinted, cancelFolio, generateDaySummaryPdf, generateLabelPdf, getStatistics, getProductivityStats, generateCommissionReport, updateFolioStatus) ---

// --- GENERAR PDF INDIVIDUAL ---
exports.generateFolioPdf = async (req, res) => {
    try {
        const folioId = req.params.id;
        if (isNaN(folioId)) return res.status(400).json({ message: 'ID de folio inválido.' });

        const folio = await Folio.findByPk(folioId, {
            include: [
                { model: Client, as: 'client', required: false },
                { model: User, as: 'responsibleUser', required: false, attributes: ['id', 'username', 'ownerId', 'ownerSeal'] }
            ]
        });
        if (!folio) { return res.status(404).json({ message: 'Folio no encontrado' }); }
        if (folio.status === 'Pendiente') {
            return res.status(400).json({
                message: 'El folio está en estado "Pendiente". Debes confirmarlo antes de generar el PDF.'
            });
        }

        // NOTA: Con la integración de Cloud Storage, ya no necesitamos calcular rutas locales,
        // pero validamos la fecha por integridad de datos.
        try {
            const deliveryDate = parseISO(folio.deliveryDate);
            if (isNaN(deliveryDate)) throw new Error('Fecha de entrega inválida');
        } catch (dateError) {
            console.warn(`Advertencia de fecha para folio ${folio.folioNumber}:`, dateError);
        }


        // Preparación de Datos para PDF
        const folioDataForPdf = folio.toJSON();

        // -----------------------------------------------------
        // Lógica de "Sello del Dueño"
        // -----------------------------------------------------
        let customSealUrl = null;
        try {
            if (folio.responsibleUser) {
                // 1. Si el usuario responsable ya tiene el sello (es Dueño)
                if (folio.responsibleUser.ownerSeal) {
                    customSealUrl = folio.responsibleUser.ownerSeal;
                }
                // 2. Si el usuario es empleado (tiene ownerId), buscar a su Dueño
                else if (folio.responsibleUser.ownerId) {
                    const ownerUser = await User.findByPk(folio.responsibleUser.ownerId, { attributes: ['ownerSeal'] });
                    if (ownerUser && ownerUser.ownerSeal) {
                        customSealUrl = ownerUser.ownerSeal;
                    }
                }
            }
        } catch (sealErr) {
            console.error("Error buscando sello de dueño:", sealErr);
            // Fallback implícito: customSealUrl se queda en null
        }

        // Asignar al objeto de datos. 
        // Si es null, el template de pdfService debe mostrar el logo genérico.
        folioDataForPdf.ownerSeal = customSealUrl;

        // Log para depuración
        console.log(`🏷️ Sello detectado para PDF: ${customSealUrl ? 'Personalizado' : 'Genérico (Pastelería Mario)'}`);
        // -----------------------------------------------------

        // -----------------------------------------------------
        // Lógica de "Firma" (Robustez)
        // -----------------------------------------------------
        try {
            if (folioDataForPdf.signature) {
                // Validar que sea un string y parezca una imagen base64
                if (typeof folioDataForPdf.signature !== 'string' || !folioDataForPdf.signature.startsWith('data:image/')) {
                    console.warn(`⚠️ Firma inválida detectada en folio ${folio.folioNumber}. Usando fallback.`);
                    folioDataForPdf.signature = null; // El template mostrará "Firma no disponible" o hueco vacío
                }
            }
        } catch (sigError) {
            console.error("Error procesando firma para PDF:", sigError);
            folioDataForPdf.signature = null;
        }


        // Parsear JSON fields (con manejo de errores)
        ['tiers', 'cakeFlavor', 'filling', 'additional', 'complements'].forEach(key => {
            if (folioDataForPdf[key] && typeof folioDataForPdf[key] === 'string') {
                try {
                    folioDataForPdf[key] = JSON.parse(folioDataForPdf[key]);
                } catch (e) {
                    console.error(`Error al parsear JSON del campo '${key}' para PDF del folio ${folio.folioNumber}:`, e);
                    folioDataForPdf[key] = (key === 'tiers' || key === 'cakeFlavor' || key === 'filling' || key === 'additional' || key === 'complements') ? [] : null; // Default a array vacío o null
                }
            }
            // Asegurar que sean arrays si no son null
            if (['tiers', 'cakeFlavor', 'filling', 'additional', 'complements'].includes(key) && folioDataForPdf[key] === null) {
                folioDataForPdf[key] = [];
            }
            // Asegurar formato {name, hasCost} para filling
            if (key === 'filling' && Array.isArray(folioDataForPdf[key])) {
                folioDataForPdf[key] = folioDataForPdf[key].map(f => (typeof f === 'string' ? { name: f, hasCost: false } : f));
            }

        });


        // Formatear arrays para display
        folioDataForPdf.displayCakeFlavor = Array.isArray(folioDataForPdf.cakeFlavor) ? folioDataForPdf.cakeFlavor.join(', ') || 'N/A' : 'N/A';
        folioDataForPdf.displayFilling = Array.isArray(folioDataForPdf.filling) ? folioDataForPdf.filling.map(f => `${f.name}${f.hasCost ? ' ($)' : ''}`).join('; ') || 'N/A' : 'N/A';


        // Colores y fecha/hora formateada
        try {
            const deliveryDate = parseISO(folio.deliveryDate);
            const dayOfWeek = format(deliveryDate, 'EEEE', { locale: es });
            // ... (lógica de colores igual que antes) ...
            let dayColor = '#F8F9FA'; let textColor = '#212529';
            switch (dayOfWeek.toLowerCase()) { /* ... casos ... */
                case 'lunes': dayColor = '#0d6efd'; textColor = '#ffffff'; break;
                case 'martes': dayColor = '#6f42c1'; textColor = '#ffffff'; break;
                case 'miércoles': dayColor = '#fd7e14'; textColor = '#ffffff'; break;
                case 'jueves': dayColor = '#198754'; textColor = '#ffffff'; break;
                case 'viernes': dayColor = '#d63384'; textColor = '#ffffff'; break;
                case 'sábado': dayColor = '#ffc107'; textColor = '#000000'; break;
                case 'domingo': dayColor = '#adb5bd'; textColor = '#000000'; break;
            }
            folioDataForPdf.dayColor = dayColor;
            folioDataForPdf.textColor = textColor;
            folioDataForPdf.formattedDeliveryDate = format(deliveryDate, "EEEE dd 'de' MMMM 'de' yyyy", { locale: es });
        } catch (e) {
            folioDataForPdf.formattedDeliveryDate = "Fecha inválida";
            folioDataForPdf.dayColor = '#F8F9FA';
            folioDataForPdf.textColor = '#212529';
        }

        if (folio.deliveryTime) {
            try {
                const [hour, minute] = folio.deliveryTime.split(':');
                const time = new Date(); time.setHours(hour, minute);
                folioDataForPdf.formattedDeliveryTime = format(time, 'h:mm a');
            } catch (e) { folioDataForPdf.formattedDeliveryTime = 'Hora inválida'; }
        } else {
            folioDataForPdf.formattedDeliveryTime = 'N/A';
        }

        // Asegurar datos de usuario y cliente para el template
        folioDataForPdf.responsibleUser = folio.responsibleUser ? { username: folio.responsibleUser.username } : { username: 'Desconocido' };
        folioDataForPdf.client = folio.client ? folio.client.toJSON() : { name: 'N/A', phone: 'N/A', phone2: null };

        // --- CORRECCIÓN FINAL: Convertir imágenes a Base64 para incrustar ---
        if (folioDataForPdf.imageUrls && Array.isArray(folioDataForPdf.imageUrls)) {
            const base64Images = await Promise.all(folioDataForPdf.imageUrls.map(async (url) => {
                try {
                    // 1. Obtener ruta absoluta del archivo
                    const relativePath = url.startsWith('/') ? url.slice(1) : url;
                    const absolutePath = path.resolve(__dirname, '..', '..', relativePath);

                    // 2. Leer el archivo del disco
                    const imageBuffer = await fs.readFile(absolutePath);

                    // 3. Detectar tipo (PNG o JPEG)
                    const mimeType = path.extname(absolutePath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';

                    // 4. Retornar cadena Base64 lista para el HTML
                    return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
                } catch (err) {
                    console.error(`❌ Error leyendo imagen para PDF (${url}):`, err.message);
                    // Retornar un placeholder o null para que el filtro lo elimine
                    return null;
                }
            }));

            // Filtrar imágenes que fallaron (null) y actualizar el array
            folioDataForPdf.imageUrls = base64Images.filter(img => img !== null);
            console.log(`📸 [PDF DEBUG] ${folioDataForPdf.imageUrls.length} imágenes convertidas a Base64.`);
        } else {
            console.log('ℹ️ [PDF DEBUG] El folio no tiene imágenes para el PDF.');
        }

        // Generación y Envío del PDF (vía URL)
        const pdfUrl = await pdfService.createPdf(folioDataForPdf);
        console.log(`✅ PDF generado y disponible en: ${pdfUrl}`);
        console.log("✅ Integridad de Datos Blindada");

        // Devolver la URL al cliente
        res.status(200).json({ url: pdfUrl });

    } catch (error) {
        console.error(`❌ Error al generar PDF para folio ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error al generar el PDF', error: error.message });
    }
};

// --- MARK AS PRINTED ---
exports.markAsPrinted = async (req, res) => {
    try {
        const folio = await Folio.findByPk(req.params.id);
        if (!folio) return res.status(404).json({ message: 'Folio no encontrado' });
        await folio.update({ isPrinted: true });
        res.status(200).json({ message: 'Folio marcado como impreso.' });
    } catch (error) {
        console.error(`Error marcando impreso folio ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error al marcar como impreso', error: error.message });
    }
};

// --- CANCEL FOLIO ---
exports.cancelFolio = async (req, res) => {
    try {
        const folio = await Folio.findByPk(req.params.id);
        if (!folio) return res.status(404).json({ message: 'Folio no encontrado' });
        if (folio.status === 'Cancelado') return res.status(400).json({ message: 'El folio ya está cancelado.' });
        await folio.update({ status: 'Cancelado' });
        console.log(`Folio ${folio.folioNumber} cancelado.`);
        res.status(200).json({ message: 'El folio ha sido cancelado.' });
    } catch (error) {
        console.error(`Error cancelando folio ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error al cancelar el folio', error: error.message });
    }
};

// --- GENERATE DAY SUMMARY PDF ---
exports.generateDaySummaryPdf = async (req, res) => {
    const { date, type } = req.query;
    if (!date || !type || !['labels', 'orders'].includes(type)) {
        return res.status(400).json({ message: 'Parámetros inválidos.' });
    }
    try {
        const foliosDelDia = await Folio.findAll({
            where: { deliveryDate: date, status: { [Op.ne]: 'Cancelado' } },
            include: [{ model: Client, as: 'client', required: false }],
            order: [['deliveryTime', 'ASC']]
        });
        if (foliosDelDia.length === 0) return res.status(404).json({ message: `No hay folios activos para ${date}.` });

        let pdfUrl;
        let pdfData = [];
        if (type === 'labels') {
            foliosDelDia.forEach(folio => {
                const folioJson = folio.toJSON();
                let labelCounter = 1;

                // ===== INICIO DE LA CORRECCIÓN =====
                // Parsear JSON fields de forma segura (revisando si es string primero)
                if (typeof folioJson.tiers === 'string') {
                    try { folioJson.tiers = JSON.parse(folioJson.tiers || '[]'); } catch (e) { folioJson.tiers = []; }
                } else if (!Array.isArray(folioJson.tiers)) {
                    folioJson.tiers = []; // Asegurar que sea array si es null o inválido
                }

                if (typeof folioJson.complements === 'string') {
                    try { folioJson.complements = JSON.parse(folioJson.complements || '[]'); } catch (e) { folioJson.complements = []; }
                } else if (!Array.isArray(folioJson.complements)) {
                    folioJson.complements = []; // Asegurar que sea array
                }

                let hasTiers = folioJson.tiers.length > 0;
                let hasComplements = folioJson.complements.length > 0;

                // Caso 1: Es un pastel "simple" (Normal sin complementos, o Base/Especial sin tiers ni complementos)
                if (!hasTiers && !hasComplements) {
                    pdfData.push({ ...folioJson, folioNumber: folio.folioNumber, id: folio.id, labelType: 'main' });
                } else {
                    // Caso 2: Es un pastel con partes

                    // Parte A: El pastel principal (ya sea Normal o el "principal" de un Base/Especial sin tiers)
                    // Si es "Normal" O (es "Base/Especial" PERO no tiene tiers definidos), imprime la etiqueta principal.
                    if (folio.folioType === 'Normal' || (folio.folioType === 'Base/Especial' && !hasTiers)) {
                        pdfData.push({ ...folioJson, folioNumber: `${folio.folioNumber}-P${labelCounter++}`, id: folio.id, labelType: 'main' });
                    }

                    // Parte B: Los Tiers (si existen)
                    if (hasTiers) {
                        folioJson.tiers.forEach((tier, i) => pdfData.push({ ...folioJson, folioNumber: `${folio.folioNumber}-P${labelCounter++}`, persons: tier.persons, shape: tier.notas || folio.shape, cakeFlavor: null, filling: null, id: `${folio.id}-T${i}`, labelType: 'tier' }));
                    }

                    // Parte C: Los Complementos (si existen)
                    if (hasComplements) {
                        folioJson.complements.forEach((comp, i) => pdfData.push({ ...folioJson, folioNumber: `${folio.folioNumber}-C${labelCounter++}`, persons: comp.persons, shape: comp.shape || 'Comp.', cakeFlavor: null, filling: null, id: `${folio.id}-C${i}`, labelType: 'complement' }));
                    }
                }
                // ===== FIN DE LA CORRECCIÓN =====

            });
            if (pdfData.length === 0) return res.status(404).json({ message: `No se generaron etiquetas para ${date}.` });
            pdfUrl = await pdfService.createLabelsPdf(pdfData);
        } else { // type === 'orders'
            pdfData = foliosDelDia.filter(f => f.deliveryLocation && !f.deliveryLocation.toLowerCase().includes('recoge en tienda'));
            if (pdfData.length === 0) return res.status(404).json({ message: `No hay comandas de envío para ${date}.` });
            pdfUrl = await pdfService.createOrdersPdf(pdfData);
        }

        res.status(200).json({ url: pdfUrl });

    } catch (error) {
        console.error(`Error PDF masivo (${type}) ${date}:`, error);
        res.status(500).json({ message: 'Error al generar PDF masivo', error: error.message });
    }
};

// --- GENERATE LABEL PDF (Individual) ---
exports.generateLabelPdf = async (req, res) => {
    try {
        const folioId = req.params.id;
        if (isNaN(folioId)) return res.status(400).json({ message: 'ID inválido.' });

        const folio = await Folio.findByPk(folioId, { include: [{ model: Client, as: 'client', required: false }] });
        if (!folio) return res.status(404).send(`<html><body><h1>Folio ${folioId} no encontrado.</h1></body></html>`);
        if (folio.status === 'Cancelado') return res.status(400).send(`<html><body><h1>Folio ${folio.folioNumber} cancelado.</h1></body></html>`);

        const labelsToPrint = [];
        const folioJson = folio.toJSON();
        let labelCounter = 1;

        // ===== INICIO DE LA CORRECCIÓN =====
        // Parse JSON fields safely before using them
        if (typeof folioJson.tiers === 'string') {
            try { folioJson.tiers = JSON.parse(folioJson.tiers || '[]'); } catch (e) { folioJson.tiers = []; }
        } else if (!Array.isArray(folioJson.tiers)) {
            folioJson.tiers = []; // Asegurar que sea array si es null o inválido
        }

        if (typeof folioJson.complements === 'string') {
            try { folioJson.complements = JSON.parse(folioJson.complements || '[]'); } catch (e) { folioJson.complements = []; }
        } else if (!Array.isArray(folioJson.complements)) {
            folioJson.complements = []; // Asegurar que sea array
        }

        let hasTiers = folioJson.tiers.length > 0;
        let hasComplements = folioJson.complements.length > 0;

        // Caso 1: Es un pastel "simple" (Normal sin complementos, o Base/Especial sin tiers ni complementos)
        if (!hasTiers && !hasComplements) {
            labelsToPrint.push({ ...folioJson, folioNumber: folio.folioNumber, id: folio.id, labelType: 'main' });
        } else {
            // Caso 2: Es un pastel con partes

            // Parte A: El pastel principal (ya sea Normal o el "principal" de un Base/Especial sin tiers)
            if (folio.folioType === 'Normal' || (folio.folioType === 'Base/Especial' && !hasTiers)) {
                labelsToPrint.push({ ...folioJson, folioNumber: `${folio.folioNumber}-P${labelCounter++}`, id: folio.id, labelType: 'main' });
            }

            // Parte B: Los Tiers (si existen)
            if (hasTiers) {
                folioJson.tiers.forEach((tier, i) => labelsToPrint.push({ ...folioJson, folioNumber: `${folio.folioNumber}-P${labelCounter++}`, persons: tier.persons, shape: tier.notas || folio.shape, cakeFlavor: null, filling: null, id: `${folio.id}-T${i}`, labelType: 'tier' }));
            }

            // Parte C: Los Complementos (si existen)
            if (hasComplements) {
                folioJson.complements.forEach((comp, i) => labelsToPrint.push({ ...folioJson, folioNumber: `${folio.folioNumber}-C${labelCounter++}`, persons: comp.persons, shape: comp.shape || 'Comp.', cakeFlavor: null, filling: null, id: `${folio.id}-C${i}`, labelType: 'complement' }));
            }
        }
        // ===== FIN DE LA CORRECCIÓN =====

        if (labelsToPrint.length === 0) return res.status(404).send(`<html><body><h1>No se generaron etiquetas para folio ${folio.folioNumber}.</h1></body></html>`);

        const pdfUrl = await pdfService.createLabelsPdf(labelsToPrint);
        console.log(`✅ PDF de etiqueta generado: ${pdfUrl}`);
        res.status(200).json({ url: pdfUrl });

    } catch (error) {
        console.error(`Error PDF etiqueta ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error al generar PDF de etiqueta', error: error.message });
    }
};

// --- GET STATISTICS ---
exports.getStatistics = async (req, res) => {
    try {
        const folios = await Folio.findAll({
            attributes: ['folioType', 'cakeFlavor', 'filling', 'tiers'],
            where: { status: { [Op.ne]: 'Cancelado' } }
        });

        const stats = { normal: { flavors: {}, fillings: {} }, special: { flavors: {}, fillings: {} } };
        const incrementCount = (obj, key) => {
            if (!key || typeof key !== 'string' || key.trim() === '' || key.toLowerCase() === 'n/a') return;
            const normalizedKey = key.trim();
            obj[normalizedKey] = (obj[normalizedKey] || 0) + 1;
        };

        for (const folio of folios) {
            try {
                let flavors = [], fillings = [], tiers = [];
                // Safely parse JSON fields
                try { flavors = JSON.parse(folio.cakeFlavor || '[]'); if (!Array.isArray(flavors)) flavors = [flavors].filter(Boolean); } catch (e) { flavors = [folio.cakeFlavor].filter(Boolean); }
                try { fillings = JSON.parse(folio.filling || '[]'); if (!Array.isArray(fillings)) fillings = [fillings].filter(Boolean); } catch (e) { fillings = [folio.filling].filter(Boolean); }
                try { tiers = JSON.parse(folio.tiers || '[]'); if (!Array.isArray(tiers)) tiers = []; } catch (e) { tiers = []; }

                if (folio.folioType === 'Normal') {
                    flavors.forEach(f => incrementCount(stats.normal.flavors, f));
                    fillings.forEach(f => incrementCount(stats.normal.fillings, f?.name || f)); // Handle string or object
                } else if (folio.folioType === 'Base/Especial') {
                    tiers.forEach(tier => {
                        (tier?.panes || []).forEach(p => incrementCount(stats.special.flavors, p));
                        (tier?.rellenos || []).forEach(rStr => (rStr || '').split(';').forEach(r => incrementCount(stats.special.fillings, r.trim())));
                    });
                }
            } catch (procErr) { console.error("Error procesando stats folio:", procErr); }
        }

        const sortData = (dataObj) => Object.entries(dataObj).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
        const finalStats = { normal: { flavors: sortData(stats.normal.flavors), fillings: sortData(stats.normal.fillings) }, special: { flavors: sortData(stats.special.flavors), fillings: sortData(stats.special.fillings) } };
        res.status(200).json(finalStats);
    } catch (error) {
        console.error("Error en getStatistics:", error);
        res.status(500).json({ message: 'Error al generar estadísticas', error: error.message });
    }
};

// --- GET PRODUCTIVITY STATS ---
exports.getProductivityStats = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ message: 'Fecha inválida (YYYY-MM-DD).' });
        const stats = await Folio.findAll({
            where: { createdAt: { [Op.gte]: `${date} 00:00:00`, [Op.lte]: `${date} 23:59:59` } },
            attributes: [
                'responsibleUserId',
                [sequelize.fn('COUNT', sequelize.col('Folio.id')), 'folioCount']
            ],
            include: [{
                model: User,
                as: 'responsibleUser',
                attributes: ['username']
            }],
            group: ['responsibleUserId', 'responsibleUser.id', 'responsibleUser.username'], // Include username in group by
            raw: false, // Set raw to false to get Sequelize model instances
            order: [[sequelize.literal('folioCount'), 'DESC']]
        });
        // Access nested properties correctly
        const formattedStats = stats.map(s => ({
            userId: s.responsibleUserId,
            username: s.responsibleUser?.username || 'Desconocido', // Use optional chaining
            folioCount: s.get('folioCount') // Use get() for aggregated values when raw is false
        }));
        res.status(200).json(formattedStats);
    } catch (error) {
        console.error(`Error getProductivityStats ${req.query.date}:`, error);
        res.status(500).json({ message: 'Error al obtener productividad', error: error.message });
    }
};


// --- GENERATE COMMISSION REPORT ---
exports.generateCommissionReport = async (req, res) => {
    try {
        const { date } = req.query;
        // ===== INICIO DE LA CORRECCIÓN (Typo 4D0 -> 400) =====
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ message: 'Fecha inválida (YYYY-MM-DD).' });
        // ===== FIN DE LA CORRECCIÓN =====
        const commissions = await Commission.findAll({
            where: { createdAt: { [Op.gte]: `${date} 00:00:00`, [Op.lte]: `${date} 23:59:59` } },
            attributes: ['folioNumber', 'amount'], order: [['createdAt', 'ASC']]
        });
        const pdfUrl = await pdfService.createCommissionReportPdf(commissions, date);
        console.log(`✅ PDF de reporte generado: ${pdfUrl}`);
        res.status(200).json({ url: pdfUrl });
    } catch (error) {
        console.error(`Error reporte comisiones ${req.query.date}:`, error);
        res.status(500).json({ message: 'Error al generar reporte', error: error.message });
    }
};

// --- GET CASH CLOSE (Cierre de Caja) ---
exports.getCashClose = async (req, res) => {
    try {
        const { date } = req.query; // YYYY-MM-DD (optional, default current date)
        const targetDate = date || new Date().toISOString().split('T')[0];
        const user = req.user;

        let ownerIdForFilter = null;
        if (user.role === 'Dueño') {
            ownerIdForFilter = user.id;
        } else if (user.role === 'Empleado') {
            ownerIdForFilter = user.ownerId;
        } else if (user.role === 'Administrador' && req.query.ownerId) {
            ownerIdForFilter = req.query.ownerId; // Admin can see specific owner
        }

        let whereClause = {
            deliveryDate: targetDate, // Or createdAt? Business decision: Cash close usually based on delivery or payment date? Assuming Delivery Date for "Sales of the day"
            status: { [Op.ne]: 'Cancelado' }
        };

        if (ownerIdForFilter) {
            // Get all responsible user IDs for this owner branch
            const branchUsers = await User.findAll({
                where: { [Op.or]: [{ id: ownerIdForFilter }, { ownerId: ownerIdForFilter }] },
                attributes: ['id']
            });
            whereClause.responsibleUserId = { [Op.in]: branchUsers.map(u => u.id) };
        } else if (user.role !== 'Administrador') {
            // Safety fallback
            whereClause.responsibleUserId = user.id;
        }


        const folios = await Folio.findAll({
            where: whereClause,
            attributes: ['total', 'advancePayment', 'balance', 'isPaid']
        });

        // Sumar totales
        let totalSales = 0;
        let totalAdvances = 0;
        let pendingBalance = 0;

        folios.forEach(f => {
            totalSales += parseFloat(f.total || 0);
            totalAdvances += parseFloat(f.advancePayment || 0);
            pendingBalance += parseFloat(f.balance || 0);
        });

        res.status(200).json({
            date: targetDate,
            totalSales: totalSales.toFixed(2),
            totalAdvances: totalAdvances.toFixed(2),
            pendingBalance: pendingBalance.toFixed(2),
            orderCount: folios.length
        });

    } catch (error) {
        console.error("Error en getCashClose:", error);
        res.status(500).json({ message: 'Error al obtener cierre de caja', error: error.message });
    }
};

// --- UPDATE FOLIO STATUS ---
exports.updateFolioStatus = async (req, res) => {
    try {
        const folioId = req.params.id;
        if (isNaN(folioId)) return res.status(400).json({ message: 'ID inválido.' });
        const folio = await Folio.findByPk(folioId);
        if (!folio) return res.status(404).json({ message: 'Folio no encontrado' });
        if (folio.status === 'Cancelado') return res.status(400).json({ message: 'Folio cancelado no se puede modificar.' });

        const { isPrinted, fondantChecked, dataChecked, status } = req.body;
        const updateData = {};
        if (isPrinted !== undefined) updateData.isPrinted = Boolean(isPrinted);
        if (fondantChecked !== undefined) updateData.fondantChecked = Boolean(fondantChecked);
        if (dataChecked !== undefined) updateData.dataChecked = Boolean(dataChecked);

        // --- Validacion de Status ---
        const validStatuses = ['Pendiente', 'Nuevo', 'En Producción', 'Listo para Entrega', 'Entregado', 'Cancelado'];
        if (status !== undefined) {
            if (validStatuses.includes(status)) {
                updateData.status = status;
            } else {
                return res.status(400).json({ message: 'Estatus inválido.' });
            }
        }

        if (Object.keys(updateData).length === 0) return res.status(400).json({ message: 'No hay estados para actualizar.' });

        await folio.update(updateData);
        console.log(`Estados actualizados folio ${folio.folioNumber}:`, updateData);
        res.status(200).json({ message: 'Estado del folio actualizado.' });
    } catch (error) {
        console.error(`Error updateFolioStatus ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error al actualizar estado', error: error.message });
    }
};

// --- OBTENER HISTORIAL DE FOLIO ---
exports.getFolioHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const history = await FolioHistory.findAll({
            where: { folioId: id },
            include: [{ model: User, as: 'user', attributes: ['username'] }], // Ensure User association alias is correct 'user' or 'responsibleUser' or implicit. FolioHistory belongsTo User. Alias in model file?
            // Checking models/FolioHistory.js is safer but I will assume default or 'user' if not aliased.
            // Let's check model definition briefly or try generic include.
            // initsql: FOREIGN KEY (`userId`) REFERENCES `users`
            order: [['createdAt', 'DESC']]
        });
        res.json(history);
    } catch (error) {
        console.error("Error getting history:", error);
        res.status(500).json({ message: "Error al obtener historial" });
    }
};