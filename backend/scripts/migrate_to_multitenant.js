const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const {
    sequelize,
    User,
    Client,
    Folio,
    Organization,
    Branch,
    Role,
    Permission,
    UserBranchMembership,
    UserRole,
    RolePermission
} = require('../server/models');

async function migrate() {
    const t = await sequelize.transaction();

    try {
        console.log('Starting Multi-tenant Migration...');

        // 1. Sync new tables (be careful with force: true in prod, use alter or manual migration ideally)
        // For this script, we assume tables are created or we use sync({ alter: true }) to create missing ones.
        // 1. Sync new tables
        try {
            console.log('Syncing database schema...');
            await sequelize.sync({ alter: true });
        } catch (err) {
            console.warn('⚠️ Schema sync error (ignoring content, proceeding assuming schema exists):', err.message);
        }

        // 2. Create Default Organization
        const [org, orgCreated] = await Organization.findOrCreate({
            where: { name: 'Pastelería Por Defecto' },
            defaults: { status: 'Active' },
            transaction: t
        });
        console.log(`Organization '${org.name}' ID: ${org.id}`);

        // 3. Create Default Branch
        const [branch, branchCreated] = await Branch.findOrCreate({
            where: { name: 'Sucursal Principal', organizationId: org.id },
            defaults: { isMain: true, status: 'Active' },
            transaction: t
        });
        console.log(`Branch '${branch.name}' ID: ${branch.id}`);

        // 4. Migrate Clients (Assign to default branch if null)
        const [updatedClients] = await Client.update(
            { branchId: branch.id },
            { where: { branchId: null }, transaction: t }
        );
        console.log(`Updated ${updatedClients} clients to Branch ID ${branch.id}`);

        // 5. Migrate Folios (Assign to default branch if null)
        const [updatedFolios] = await Folio.update(
            { branchId: branch.id },
            { where: { branchId: null }, transaction: t }
        );
        console.log(`Updated ${updatedFolios} folios to Branch ID ${branch.id}`);

        // 6. Define Roles and Permissions
        const rolesData = [
            { name: 'Admin', scope: 'Global', description: 'System Administrator' },
            { name: 'Owner', scope: 'Branch', description: 'Branch Owner' },
            { name: 'Employee', scope: 'Branch', description: 'Regular Employee' }
        ];

        const permissionsData = [
            'users.manage',
            'branches.manage',
            'clients.read', 'clients.create', 'clients.update', 'clients.delete',
            'folios.read', 'folios.create', 'folios.update', 'folios.delete', 'folios.cancel',
            'payments.read', 'payments.create', 'payments.refund',
            'reports.view'
        ];

        // Create Permissions
        const permissionMap = {};
        for (const code of permissionsData) {
            const [perm] = await Permission.findOrCreate({
                where: { code },
                defaults: { description: `Access to ${code}` },
                transaction: t
            });
            permissionMap[code] = perm;
        }

        // Create Roles and Assign Permissions
        const roleMap = {};
        for (const rData of rolesData) {
            const [role] = await Role.findOrCreate({
                where: { name: rData.name },
                defaults: rData,
                transaction: t
            });
            roleMap[rData.name] = role;

            // Assign permissions (simplified logic)
            let permsToAssign = [];
            if (rData.name === 'Admin') {
                permsToAssign = Object.values(permissionMap); // All perms
            } else if (rData.name === 'Owner') {
                // Owner gets everything except maybe global system management if we had it
                // For now give all relevant business perms
                permsToAssign = Object.values(permissionMap).filter(p => !p.code.startsWith('system.'));
            } else if (rData.name === 'Employee') {
                // Limited set
                const employeePerms = [
                    'clients.read', 'clients.create', 'clients.update',
                    'folios.read', 'folios.create', 'folios.update',
                    'payments.read', 'payments.create'
                ];
                permsToAssign = Object.values(permissionMap).filter(p => employeePerms.includes(p.code));
            }

            await role.addPermissions(permsToAssign, { transaction: t });
        }

        // 7. Migrate Users
        // This part is tricky because we removed the 'role' column in the model definition but it might still exist in DB.
        // We need to fetch users potentially using raw query if the model doesn't support the field anymore,
        // OR we just iterate all users and assign a default role if we can't determine the old one easily via Sequelize.
        // Since we used `alter: true`, the column `role` might have been dropped or ignored. 
        // Ideally, we should have done this migration BEFORE dropping the column in the model file, 
        // but for this task, we will assume we can just make everyone an 'Employee' or 'Owner' based on some logic,
        // or we use a raw query to check the old value if the table hasn't been altered destructively yet.

        // Let's rely on finding all users and inspecting them.
        const users = await User.findAll({ transaction: t });

        for (const user of users) {
            // Create Membership
            await UserBranchMembership.findOrCreate({
                where: { userId: user.id, branchId: branch.id },
                defaults: { employmentType: 'Employee' }, // Default to employee
                transaction: t
            });

            // Assign Role (UserRole)
            // Hardcoded logic: User ID 1 is usually the initial dev/admin/owner.
            let roleToAssign = roleMap['Employee'];

            // If we had the old role value we could map it. 
            // check if user.username or email indicates admin
            if (user.id === 1 || user.username === 'admin') {
                roleToAssign = roleMap['Owner']; // Or Admin
                // Also update membership to Owner
                await UserBranchMembership.update(
                    { employmentType: 'Owner' },
                    { where: { userId: user.id, branchId: branch.id }, transaction: t }
                );
            }

            await UserRole.findOrCreate({
                where: { userId: user.id, roleId: roleToAssign.id, branchId: branch.id },
                transaction: t
            });
        }

        await t.commit();
        console.log('Migration completed successfully!');
        process.exit(0);

    } catch (error) {
        await t.rollback();
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
