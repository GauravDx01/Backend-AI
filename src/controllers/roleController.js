const Role = require('../models/roleSchema');

exports.createRole = async (req, res) => {
  try {
    const { role, description, permissions } = req.body;

    // Format permissions into an array that matches the schema
    const formattedPermissions = permissions.map(permission => ({
      moduleName: permission.moduleName,
      permissions: {
        create: permission.create,
        read: permission.read,
        update: permission.update,
        delete: permission.delete
      }
    }));

    // Create a new role document
    const newRole = new Role({ role, description, permissions: formattedPermissions });

    // Save the role to the database
    const savedRole = await newRole.save();
    res.status(201).json({ message: 'Role created successfully', data: savedRole });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Failed to create role' });
  }
};


// Retrieve all roles
exports.getRoles = async (req, res) => {
    try {
        const result = await Role.find();
        res.status(200).json({ message: 'Roles retrieved successfully', data: result });
    } catch (error) {
        console.error('Error retrieving roles:', error);
        res.status(500).json({ error: 'Failed to retrieve roles' });
    }
};

// Retrieve a role by ID
exports.getRouteForEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Role.findById(id);
        if (!result) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json({ message: 'Role retrieved successfully', data: result });
    } catch (error) {
        console.error('Error retrieving role for edit:', error);
        res.status(500).json({ error: 'Failed to retrieve role for edit' });
    }
};

// Update a role by ID
exports.editRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, description, permissions } = req.body;

        // Find the role by ID and update it with the new data
        const updatedRole = await Role.findByIdAndUpdate(
            id,
            { role, description, permissions },
            { new: true, runValidators: true }
        );

        if (!updatedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.status(200).json({ message: 'Role updated successfully', data: updatedRole });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'Failed to update role' });
    }
};

// Delete a role by ID
exports.delRoles = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Role.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.status(200).json({ message: 'Role deleted successfully', data: result });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ error: 'Failed to delete role' });
    }
};
