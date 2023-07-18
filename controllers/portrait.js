const Portrait = require('../models/portrait');
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: process.env.CLOUD_NAME, api_key: process.env.API_KEY, api_secret: process.env.API_SECRET });

const controller = {
  getPortraits: async (req, res) => {
    try {
      const portraits = await Portrait.find({}).limit(1);
      if (!portraits) {
        return res.status(404).send({
          status: "Error",
          message: "Resource Not Found: We couldn't find the requested page or resource."
        });
      }
      return res.status(200).send({
        status: "Success",
        portraits
      });
    }
    catch (err) {
      return res.status(500).send({
        status: "Error",
        message: "Internal Server Error: An unexpected error occurred."
      });
    }
  },
  getPortrait: async (req, res) => {
    try {
      const portraitId = req.params.id;
      if (!portraitId || portraitId == null) {
        return res.status(404).send({
          status: "Error",
          message: "Resource Not Found: We couldn't find the requested page or resource."
        });
      }
      const portrait = await Portrait.findById(portraitId);
      if (!portrait) {
        return res.status(404).send({
          status: "Error",
          message: "Resource Not Found: We couldn't find the requested page or resource."
        });
      }
      return res.status(200).send({
        status: "Success",
        portrait
      });
    }
    catch (err) {
      return res.status(500).send({
        status: "Error",
        message: "Internal Server Error: An unexpected error occurred."
      });
    }
  },
  updatePortrait: async (req, res) => {
    const portraitId = req.params.id;
    const body = req.body;
    try {
      let imageData = await Portrait.findById(portraitId);
      if (req.files?.image0url) {
        if (imageData.image0url) {
          let dataLength = imageData.image0url.split(".");
          let imageName = dataLength[dataLength.length - 2].split("/").pop()
          await cloudinary.uploader.destroy(imageName);
        }
        const image = await cloudinary.uploader.upload(req.files.image0url.path,
          {
            upload_preset: "portrait",
            unique_filename: true,
            use_filename: true,
            overwrite: true,
            public_id: `${req.files.image0url.originalFilename.split(".")[0]}`,
          });
        body.image0url = image.secure_url;
      }
      const portrait = await Portrait.findOneAndUpdate({ _id: portraitId }, body, { new: true, runValidators: true });
      if (!portrait) {
        return res.status(404).send({
          status: "Error",
          message: "Resource Not Found: We couldn't find the requested page or resource."
        });
      }
      return res.status(200).send({
        status: "Success",
        portrait
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