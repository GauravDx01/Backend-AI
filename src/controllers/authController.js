const User = require("../models/user"); // Correct the model import capitalization
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findByIdAndUpdate } = require("../models/fetchDataModels");

const register = async (req, res) => {
  const { username, password, role , phoneNumber , gender , email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Fixed variable name
    const result = new User({ username, password: hashedPassword, role  , phoneNumber , gender , email  });
    await result.save();
    res.status(201).send({
      msg: "User created",
      data: result,
    });
  } catch (err) {
    res.status(500).send("Error registering new user");
  }
};
// get user details to edit  user


const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await User.findById(id);
    if (!result) {
      return res.status(404).send({
        msg: "User not found"
      });
    }
    res.status(200).send({
      msg: "Data retrieved successfully",
      data: result
    });
  } catch (error) {
    res.status(500).send({
      msg: "Internal server error"
    });
  }
}


const editUser = async(req , res)=>{
  const {id} = req.params
  const {username , role , phoneNumber , gender , email } = req.body
  try {
    const result = await  User.findByIdAndUpdate(id , {username , role , phoneNumber , gender , email })
    if (!result) {
      return res.status(404).send({
        msg: "User not found"
      });
    }
    res.status(200).send({
      msg: "Data updated successfully",
      data: result
    });
    
  } catch (error) {
    res.status(500).send({
      msg: "Internal server error"
    });
    
  }
}


const deleteUser = async (req , res)=>{
  const {id} = req.params
  try {
    const result = await User.findByIdAndDelete(id)
    if (!result) {
      return res.status(404).send({
        msg: "User not found"
      });
    }
    res.status(200).send({
      msg: "Data deleted sucessfully",
      data: result
    });
  } catch (error) {
    res.status(500).send({
      msg: "Internal server error"
    });
    
  }
}


const getAllUsers = async(req , res)=>{
  try {
    const result = await User.find()
    res.status(200).json({ message: 'Users retrieved successfully', data: result });
    
} catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
    
}
}

















const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const data = await User.findOne({ username }); // Await the result of the findOne call
    if (data && await bcrypt.compare(password, data.password)) {
      const token = jwt.sign({ id: data._id, role: data.role }, "secret", {
        expiresIn: "5h",
      });
      res.json({ token, role: data.role });
    } else {
      res.status(401).send({
        msg: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
};

module.exports = { register, login , getUser  , editUser , deleteUser , getAllUsers};
