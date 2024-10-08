const User = require("../models/user_model");
const lecturerEmails = ['lecturer@ac.sce.ac.il',
 'hadasda1@ac.sce.ac.il',
 'liorar1@ac.sce.ac.il',
 'tammash@ac.sce.ac.il',
 'marinak@ac.sce.ac.il',
 'bnayasa@ac.sce.ac.il',
 'havatzelet@ac.sce.ac.il',
 'davidt@ac.sce.ac.il'
];

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
  const { name, email, password, idNumber } = req.body;
  const emailPattern = /^[a-zA-Z0-9._-]+@ac\.sce\.ac\.il$/;
  const idNumberPattern = /^\d{9}$/;

  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: 'Invalid email format. Must be in the form _____@ac.sce.ac.il' });
  }
  if (!idNumberPattern.test(idNumber)) {
    return res.status(400).json({ error: 'Invalid ID number format. Must be a 9-digit number' });
  }
  if (!idNumber || idNumber.trim() === '') {
    return res.status(400).json({ error: 'ID Number is required' });
  }

  try {
    const role = lecturerEmails.includes(email) ? 'admin' : 'user';
    const user = await User.create({ name, email, password, idNumber, role });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error(error);
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
      res.status(200).json({ 
          message: "Login successful", 
          userID: user._id, 
          name: user.name, 
          email: user.email,
          role: user.role
 
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const getUserNames = async (req, res) => {
  try {
      const { userIds } = req.body;
      const users = await User.find({ _id: { $in: userIds } }, 'name _id idNumber');
      res.json(users);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};


module.exports = { 
  getUsers, 
  postUsers, 
  putUsers, 
  deleteUsers,
  getUserById, 
  registerUser, 
  loginUser,
  getUserNames
};