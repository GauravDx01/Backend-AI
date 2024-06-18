const Role = require('../models/roleSchema');

exports.createRole = async (req, res) => {
    try {
        const { role, description, permissions } = req.body;

        // Create a new role document
        const newRole = new Role({ role, description, permissions });

        // Save the role to the database
        const savedRole = await newRole.save();
        res.status(201).json({ message: 'Role created successfully', data: savedRole });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ error: 'Failed to create role' });
    }
};


exports.getRoles = async(req , res)=>{
    try {
        const result = await Role.find()
        res.status(200).json({ message: 'Roles retrieved successfully', data: result });
        
    } catch (error) {
        console.error('Error retrieving roles:', error);
        res.status(500).json({ error: 'Failed to retrieve roles' });
        
    }
}
exports.getRouteForEdit = async(req , res)=>{
    try {
        const { id } = req.params; // Destructure the id from req.params
        const result = await Role.findById(id); // Use findById to query by _id
        if (!result) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json({ message: 'Role retrieved successfully', data: result });
    } catch (error) {
        console.error('Error retrieving roles:', error);
        res.status(500).json({ error: 'Failed to retrieve roles' });
    }
}
exports.editRole = async(req , res)=>{
   
    try {
        const  {id} = req.params 
        const { role, description, permissions } = req.body;
     // Find the role by ID and update it with the new data
     const updatedRole = await Role.findByIdAndUpdate(
        id,
        { role, description, permissions },
        { new: true, runValidators: true } // Options: return the updated document and run validators
    );

    if (!updatedRole) {
        return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json({ message: 'Role updated successfully', data: updatedRole });
} catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
}
}

exports.delRoles = async(req , res)=>{
    const  {id} = req.params 
    
    try {
        const result = await Role.findByIdAndDelete(id)

        if (!result) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json({ message: 'Role deleted successfully', data: result });
    } catch (error) {
        console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to delete role' });
    }
}