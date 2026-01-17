const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const pLimit = require('p-limit');

// --- CONFIGURACIÓN ---
const storage = new Storage(); // Busca credenciales en GOOGLE_APPLICATION_CREDENTIALS
const bucketName = process.env.GCS_BUCKET_NAME || 'pasteleria-folios-bucket'; // Nombre del bucket en .env

// Limite de concurrencia: Máximo 2 procesos de PDF simultáneos
const limit = pLimit(2);

/**
 * Sube un buffer a Google Cloud Storage y retorna la URL pública.
 * @param {Buffer} buffer - El contenido del PDF.
 * @param {string} fileName - Nombre del archivo a guardar.
 * @returns {Promise<string>} - URL pública del archivo.
 */
async function uploadToStorage(buffer, fileName) {
    try {
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(fileName);

        await file.save(buffer, {
            contentType: 'application/pdf',
            resumable: false,
            // Configurar para que sea público si el bucket no es uniforme
            // Nota: Es mejor configurar el bucket para acceso público o usar URLs firmadas.
            // Aquí asumiremos que podemos hacerlo público o generar una URL firmada.
            // Opción A: Hacer público
            // validation: 'false'
        });

        // Alternativa: Si el bucket es público por defecto, solo construimos la URL.
        // O hacemos el archivo público explícitamente:
        // await file.makePublic(); 

        // Retornar la URL pública directa (asumiendo bucket público)
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        console.log(`☁️ Archivo subido a GCS: ${publicUrl}`);
        return publicUrl;
    } catch (error) {
        console.error('❌ Error subiendo a GCS:', error);
        throw new Error('Falló la subida a Cloud Storage');
    }
}

/**
 * Función interna para generar Buffer de PDF con Puppeteer.
 * @param {string} html - Contenido HTML.
 * @param {Object} options - Opciones de formato.
 */
async function generatePdfBuffer(html, options = {}) {
    let browser;
    try {
        browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // Útil para Docker/entornos con poca memoria compartida
                '--single-process' // Reduce consumo de memoria en versiones recientes
            ],
            headless: 'new'
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfOptions = {
            format: 'Letter',
            printBackground: true,
            displayHeaderFooter: options.displayHeaderFooter || false,
            headerTemplate: options.headerTemplate || '<div></div>',
            footerTemplate: options.footerTemplate || '<div></div>',
            margin: options.margin || { top: '20px', right: '20px', bottom: '20px', left: '20px' }
        };

        const buffer = await page.pdf(pdfOptions);
        return buffer;

    } catch (error) {
        console.error('❌ Error interno generando PDF Buffer:', error);
        throw error;
    } finally {
        if (browser) await browser.close();
    }
}

// --- SERVICIOS EXPORTADOS ---

/**
 * Crea un PDF de folio individual, lo sube a la nube y devuelve la URL.
 * @param {Object} folioData - Datos del folio.
 * @returns {Promise<string>} - URL del PDF generado.
 */
exports.createPdf = async (folioData) => {
    return limit(async () => {
        try {
            console.log('📄 [PDF SERVICE] Generando PDF para folio:', folioData.folioNumber);
            const templatePath = path.join(__dirname, '../templates/folioTemplate.ejs');
            const html = await ejs.renderFile(templatePath, { folio: folioData });

            const footerText = `Pedido capturado por: ${folioData.responsibleUser?.username || 'Sistema'} el ${new Date(folioData.createdAt).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`;

            const options = {
                displayHeaderFooter: true,
                margin: { top: '25px', right: '25px', bottom: '40px', left: '25px' },
                footerTemplate: `
                  <div style="width: 100%; font-size: 9pt; text-align: center; padding: 10px 25px 0 25px; border-top: 1px solid #f0f0f0; box-sizing: border-box;">
                    ${footerText}
                  </div>
                `
            };

            const pdfBuffer = await generatePdfBuffer(html, options);

            // Subir a la nube
            const fileName = `Folio-${folioData.folioNumber}-${Date.now()}.pdf`;
            const publicUrl = await uploadToStorage(pdfBuffer, fileName);

            return publicUrl; // Devolvemos URL en lugar de Buffer

        } catch (error) {
            console.error('❌ Error durante la creación del PDF individual:', error);
            throw error;
        }
    });
};

/**
 * Función genérica para crear PDFs masivos (etiquetas y comandas) y subirlos.
 */
async function generateBulkPdf(templateName, data, date = null, fileNamePrefix = 'Doc') {
    return limit(async () => {
        try {
            const templatePath = path.join(__dirname, `../templates/${templateName}.ejs`);
            const html = await ejs.renderFile(templatePath, { folios: data, date: date, commissions: data });

            const options = {
                margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
            };

            const pdfBuffer = await generatePdfBuffer(html, options);

            const fileName = `${fileNamePrefix}-${date || Date.now()}.pdf`;
            const publicUrl = await uploadToStorage(pdfBuffer, fileName);

            return publicUrl;

        } catch (error) {
            console.error(`❌ Error durante la creación del PDF de ${templateName}:`, error);
            throw error;
        }
    });
}

exports.createLabelsPdf = async (folios) => {
    const dateStr = folios.length > 0 && folios[0].deliveryDate ? folios[0].deliveryDate : 'General';
    return generateBulkPdf('labelsTemplate', folios, dateStr, 'Etiquetas');
};

exports.createOrdersPdf = async (folios) => {
    const dateStr = folios.length > 0 && folios[0].deliveryDate ? folios[0].deliveryDate : 'General';
    return generateBulkPdf('ordersTemplate', folios, dateStr, 'Comandas');
};

exports.createCommissionReportPdf = async (commissions, date) => {
    try {
        // Nota: Commission logic is slightly different in params, adapting logic here or using generateBulkPdf if compatible
        // The original used generatePdf directly for commissions. Let's wrap it in limit too.
        return limit(async () => {
            const templatePath = path.join(__dirname, '../templates/commissionReportTemplate.ejs');
            const html = await ejs.renderFile(templatePath, { commissions, date });

            const options = { margin: { top: '25px', right: '25px', bottom: '25px', left: '25px' } };
            const pdfBuffer = await generatePdfBuffer(html, options);

            const fileName = `ReporteComisiones-${date}.pdf`;
            const publicUrl = await uploadToStorage(pdfBuffer, fileName);
            return publicUrl;
        });
    } catch (error) {
        console.error(`❌ Error durante la creación del PDF de comisiones:`, error);
        throw error;
    }
};
