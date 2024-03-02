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
  
  module.exports = { 
    getUsers, 
    postUsers, 
    putUsers, 
    deleteUsers,
    getUserById 
  };