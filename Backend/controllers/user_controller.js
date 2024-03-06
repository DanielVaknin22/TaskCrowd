const User = require("../models/user_model");

const getUsers = async (req, res) => {
  console.log("user get");
  try {
    let user;
    if (req.query.name) {
      user = await User.find({ name: req.query.name });
    } else {
      user = await User.find();
    }
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

const getUserById = async (req, res) => {
  console.log(req.params);
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      return res.status(200).send(user);
    }  
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
}};
  
const postUsers = async (req, res) => {
  console.log("user post");
  try {
    const user = await User.create(req.body);
    res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
  
const putUsers = (req, res) => {
};
  
const deleteUsers = async (req, res) => {
  console.log("user delete");
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }  
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const emailPattern = /^[a-zA-Z0-9._-]+@ac\.sce\.ac\.il$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: 'Invalid email format. Must be in the form _____@ac.sce.ac.il' });
  }
  try {
    const user = await User.create({ name, email, password });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).json({ message: "Invalid email" });
      }
      if (password !== user.password) {
          return res.status(401).json({ message: "Invalid password" });
      }
      await user.save();
      res.status(200).json({ message: "Login successful", userID: user._id, email: user.email });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  getUsers, 
  postUsers, 
  putUsers, 
  deleteUsers,
  getUserById, 
  registerUser, 
  loginUser
};