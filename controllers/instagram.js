const Token = require('../models/instagram');

const controller = {
  save: async (req, res) => {
    const { token } = req.body;
    try {
      const tokenI = new Token();
      tokenI.token = token;
      const data = await token.save();
      if (data) {
        return res.status(200).send({
          status: "Success",
          token: data
        });
      }
    } catch (err) {
      return res.status(200).send({
        status: "Error",
        message: "Faltan datos por enviar"
      });
    }
  },
  getTokens: async (req, res) => {
    try {
      const tokens = await Token.find({}).sort({ _id: 'desc' }).limit(1);;
      if (!tokens) {
        return res.status(404).send({
          status: "Error",
          message: "Resource Not Found: We couldn't find the requested page or resource."
        });
      }
      return res.status(200).send({
        status: "Success",
        tokens
      });
    }
    catch (err) {
      return res.status(500).send({
        status: "Error",
        message: "Internal Server Error: An unexpected error occurred."
      });
    }
  },
  getToken: async (req, res) => {
    try {
      const tokenId = req.params.id;
      if (!tokenId || tokenId == null) {
        return res.status(404).send({
          status: "Error",
          message: "Resource Not Found: We couldn't find the requested page or resource."
        });
      }
      const token = await Token.findById(tokenId);
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
  update: async (req, res) => {
    const tokenId = req.params.id;
    const body = req.body;
    try {
      const token = await Token.findOneAndUpdate({ _id: tokenId }, body, { new: true, runValidators: true });
      if (!token) {
        return res.status(404).send({
          status: "Error",
          message: "Resource Not Found: We couldn't find the requested page or resource."
        });
      }
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
  }
}

module.exports = controller;