const { sequelize } = require('../config/database');

// Import all models
const Organization = require('./Organization');
const Branch = require('./Branch');
const UserBranchMembership = require('./UserBranchMembership');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const UserRole = require('./UserRole');
const Payment = require('./Payment');
const FolioStatusHistory = require('./FolioStatusHistory');
const FolioNote = require('./FolioNote');
const FolioAttachment = require('./FolioAttachment');

const User = require('./user'); // Note: file name is user.js (lowercase)
const Client = require('./client'); // Note: file name is client.js (lowercase)
const Folio = require('./Folio');
const FolioEditHistory = require('./FolioEditHistory');
const Commission = require('./Commission');
const AISession = require('./AISession');
const Flavor = require('./Flavor');
const Filling = require('./Filling');
const SystemLog = require('./SystemLog');

// ==========================================
// Definitions of Associations
// ==========================================

// --- Organization & Branch ---
Organization.hasMany(Branch, { foreignKey: 'organization_id', as: 'branches' });
Branch.belongsTo(Organization, { foreignKey: 'organization_id', as: 'organization' });

// --- Branch & User (via Memberships) ---
Branch.hasMany(UserBranchMembership, { foreignKey: 'branch_id', as: 'memberships' });
UserBranchMembership.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });

User.hasMany(UserBranchMembership, { foreignKey: 'user_id', as: 'memberships' });
UserBranchMembership.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Convenience many-to-many
Branch.belongsToMany(User, { through: UserBranchMembership, foreignKey: 'branch_id', otherKey: 'user_id', as: 'users' });
User.belongsToMany(Branch, { through: UserBranchMembership, foreignKey: 'user_id', otherKey: 'branch_id', as: 'branches' });

// --- RBAC: Roles & Permissions ---
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id', otherKey: 'permission_id', as: 'permissions' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id', otherKey: 'role_id', as: 'roles' });

// --- RBAC: Users & Roles (scoped to branch implicitly via UserRole table logic) ---
User.hasMany(UserRole, { foreignKey: 'user_id', as: 'userRoles' });
UserRole.belongsTo(User, { foreignKey: 'user_id' });

Role.hasMany(UserRole, { foreignKey: 'role_id', as: 'roleAssignments' });
UserRole.belongsTo(Role, { foreignKey: 'role_id' });

Branch.hasMany(UserRole, { foreignKey: 'branch_id' });
UserRole.belongsTo(Branch, { foreignKey: 'branch_id' });

// --- Branch Scoping for Core Models ---
Branch.hasMany(Client, { foreignKey: 'branch_id', as: 'clients' });
Client.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });

Branch.hasMany(Folio, { foreignKey: 'branch_id', as: 'folios' });
Folio.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });

Branch.hasMany(Payment, { foreignKey: 'branch_id', as: 'payments' });
Payment.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });

// --- Legacy & Core Associations ---
User.hasMany(Folio, { foreignKey: 'responsibleUserId' });
Folio.belongsTo(User, { as: 'responsibleUser', foreignKey: 'responsibleUserId' });

Client.hasMany(Folio, { foreignKey: 'clientId' });
Folio.belongsTo(Client, { as: 'client', foreignKey: 'clientId' });

// --- Folio Details and History ---
Folio.hasOne(Commission, { foreignKey: 'folioId', as: 'commission' });
Commission.belongsTo(Folio, { foreignKey: 'folioId', as: 'folio' });

Folio.hasMany(FolioEditHistory, { as: 'editHistory', foreignKey: 'folioId' });
FolioEditHistory.belongsTo(Folio, { foreignKey: 'folioId' });

User.hasMany(FolioEditHistory, { foreignKey: 'editorUserId' });
FolioEditHistory.belongsTo(User, { as: 'editor', foreignKey: 'editorUserId' });

// New Folio features
Folio.hasMany(Payment, { foreignKey: 'folio_id', as: 'payments' });
Payment.belongsTo(Folio, { foreignKey: 'folio_id', as: 'folio' });

Folio.hasMany(FolioStatusHistory, { foreignKey: 'folio_id', as: 'statusHistory' });
FolioStatusHistory.belongsTo(Folio, { foreignKey: 'folio_id', as: 'folio' });

Folio.hasMany(FolioNote, { foreignKey: 'folio_id', as: 'notes' });
FolioNote.belongsTo(Folio, { foreignKey: 'folio_id', as: 'folio' });

Folio.hasMany(FolioAttachment, { foreignKey: 'folio_id', as: 'attachments' });
FolioAttachment.belongsTo(Folio, { foreignKey: 'folio_id', as: 'folio' });

// Creator tracking for new items
User.hasMany(Payment, { foreignKey: 'created_by' });
Payment.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(FolioStatusHistory, { foreignKey: 'changed_by' });
FolioStatusHistory.belongsTo(User, { foreignKey: 'changed_by', as: 'editor' });

User.hasMany(FolioNote, { foreignKey: 'created_by' });
FolioNote.belongsTo(User, { foreignKey: 'created_by', as: 'author' });

User.hasMany(FolioAttachment, { foreignKey: 'created_by' });
FolioAttachment.belongsTo(User, { foreignKey: 'created_by', as: 'uploader' });


module.exports = {
  sequelize,
  // New Models
  Organization,
  Branch,
  UserBranchMembership,
  Role,
  Permission,
  RolePermission,
  UserRole,
  Payment,
  FolioStatusHistory,
  FolioNote,
  FolioAttachment,
  // Existing Models
  User,
  Client,
  Folio,
  FolioEditHistory,
  Commission,
  AISession,
  Flavor,
  Filling,
  SystemLog
};