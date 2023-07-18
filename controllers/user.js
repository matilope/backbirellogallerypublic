const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const controller = {
  register: async (req, res) => {
    let { email, password } = req.body;
    try {
      password = await bcrypt.hash(password, 12);
      const payload = { subject: email, extra: password };
      const token = jwt.sign(payload, process.env.PRIVATEKEY);
      const user = new User({ email, password });
      const save = await user.save();
      if (save) {
        return res.status(200).send({
          status: "Success",
          token
        });
      }
    }
    catch (err) {
      return res.status(500).send({
        status: "Error",
        message: "Internal Server Error: An unexpected error occurred."
      });
    }
  },
  login: async (req, res) => {
    try {
      const userData = req.body;
      const user = await User.findOne({ email: userData.email });
      if (!user) {
        return res.status(404).send({
          status: "Error",
          message: "Invalid user"
        });
      }
      const passwordCheck = await bcrypt.compare(userData.password, user.password);
      if (!passwordCheck) {
        return res.status(401).send({
          status: "Error",
          message: "Invalid password"
        });
      }
      const payload = { subject: user.email, extra: user.password };
      const token = jwt.sign(payload, process.env.PRIVATEKEY);
      return res.status(200).send({
        status: "Success",
        token
      });
    }
    catch (err) {
      return res.status(500).send({
        status: "Error",
        message: "Internal Server Error: An unexpected error occurred."
      });
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.find({}).sort({ _id: 'desc' }).limit(20);
      if (!users) {
        return res.status(404).send({
          status: "Error",
          message: "Resource Not Found: We couldn't find the requested page or resource."
        });
      }
      return res.status(200).send({
        status: "Success",
        users
      });
    }
    catch (err) {
      return res.status(500).send({
        status: "Error",
        message: "Internal Server Error: An unexpected error occurred."
      });
    }
  },
  deleteUser: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findOneAndDelete({ _id: userId });
      if (!user) {
        return res.status(404).send({
          status: "Error",
          message: "Resource Not Found: We couldn't find the requested page or resource."
        });
      }
      return res.status(200).send({
        status: "Success",
        user
      });
    }
    catch (err) {
      return res.status(500).send({
        status: "Error",
        message: "Internal Server Error: An unexpected error occurred."
      });
    }
  }
}

module.exports = controller;