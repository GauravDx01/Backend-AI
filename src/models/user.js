const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user",
    
  },
  phoneNumber : {
    type: String
  },
  gender : {
    type : String
  },
  email :{
    type : String
  }
});
module.exports = mongoose.model('user' , userSchema)