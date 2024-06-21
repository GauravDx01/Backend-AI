const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  create: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  delete: { type: Boolean, default: false }
});

const roleSchema = new mongoose.Schema({
  role: { type: String, required: true, maxlength: 50 },
  description: { type: String, required: true, minlength: 10, maxlength: 200 },
  permissions: [{
    moduleName: { type: String, required: true },
    permissions: { type: permissionSchema, required: true }
  }]
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
