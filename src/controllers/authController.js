const User = require("../models/user"); // Correct the model import capitalization
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Fixed variable name
    const result = new User({ username, password: hashedPassword, role });
    await result.save();
    res.status(201).send({
      msg: "User created",
      data: result,
    });
  } catch (err) {
    res.status(500).send("Error registering new user");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const data = await User.findOne({ username }); // Await the result of the findOne call
    if (data && await bcrypt.compare(password, data.password)) {
      const token = jwt.sign({ id: data._id, role: data.role }, "secret", {
        expiresIn: "24h",
      });
      res.json({ token });
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

module.exports = { register, login };
