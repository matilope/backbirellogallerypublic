const Painting = require('../models/painting');
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: process.env.CLOUD_NAME, api_key: process.env.API_KEY, api_secret: process.env.API_SECRET });

const options = {
  upload_preset: "paintings",
  unique_filename: true,
  use_filename: true,
  overwrite: true,
};

const controller = {
  save: async (req, res) => {
    try {
      const { title, subtitle, description, dimension, characteristics, link, link2 } = req.body;
      const paint = new Painting();
      paint.title = title;
      paint.subtitle = subtitle;
      paint.description = description;
      paint.dimension = dimension;
      paint.characteristics = characteristics;
      paint.link = link;
      paint.link2 = link2;
      const image0url = await cloudinary.uploader.upload(req.files.image0url.path, options);
      paint.image0url = image0url.secure_url;
      if (req.files.image1url) {
        const image1url = await cloudinary.uploader.upload(req.files.image1url.path, options);
        paint.image1url = image1url.secure_url;
      } else {
        paint.image1url = null;
      }
      if (req.files.image2url) {
        const image2url = await cloudinary.uploader.upload(req.files.image2url.path, options);
        paint.image2url = image2url.secure_url;
      } else {
        paint.image2url = null;
      }

      const save = await paint.save();
      if (save) {
        return res.status(200).send({
          status: "Success",
          paint: save
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
  getPinturas: async (req, res) => {
    try {
      let paints = await Painting.find({}).sort({ _id: 'desc' });

      if (!paints) {
        return res.status(404).send({
          status: "Error",
          message: "Resource Not Found: We couldn't find the requested page or resource."
        });
      }
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const results = {};

      if (endIndex < paints.length) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }

      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }

      results.total = Math.ceil(paints.length / limit);
      paints = paints.slice(startIndex, endIndex).sort(() => Math.random() - 0.5);

      return res.status(200).send({
        status: "Success",
        paints: paints,
        results
      });
    }
    catch (err) {
      return res.status(500).send({
        status: "Error",
        message: "Internal Server Error: An unexpected error occurred."
      });
    }
  },
  getPintura: async (req, res) => {
    try {
      const paintId = req.params.id;
      if (!paintId || paintId == null) {
        return res.status(404).send({
          status: "Error",
          message: "Resource Not Found: We couldn't find the requested page or resource."
        });
      }
      const paint = await Painting.findById(paintId);
      return res.status(200).send({
        status: "Success",
        paint
      });
    } catch (err) {
      return res.status(500).send({
        status: "Error",
        message: "Internal Server Error: An unexpected error occurred."
      });
    }
  },
  update: async (req, res) => {
    const paintingId = req.params.id;
    const body = req.body;
    try {
      let imageData = await Painting.findById(paintingId);
      if (req.files.image0url) {
        if (imageData.image0url) {
          let dataLength = imageData.image0url.split(".");
          let imageName = dataLength[dataLength.length - 2].split("/").pop();
          await cloudinary.uploader.destroy(imageName);
        }
        const image = await cloudinary.uploader.upload(req.files.image0url.path, options);
        body.image0url = image.secure_url;
      }
      if (req.files.image1url) {
        if (imageData.image1url) {
          let dataLength = imageData.image1url.split(".");
          let imageName = dataLength[dataLength.length - 2].split("/").pop();
          await cloudinary.uploader.destroy(imageName);
        }
        const image = await cloudinary.uploader.upload(req.files.image1url.path, options);
        body.image1url = image.secure_url;
      }
      if (req.files.image2url) {
        if (imageData.image2url) {
          let dataLength = imageData.image2url.split(".");
          let imageName = dataLength[dataLength.length - 2].split("/").pop();
          await cloudinary.uploader.destroy(imageName);
        }
        const image = await cloudinary.uploader.upload(req.files.image2url.path, options);
        body.image2url = image.secure_url;
      }
      if (body.image1url == "null") {
        body.image1url = null;
      }
      if (body.image2url == "null") {
        body.image2url = null;
      }
      const paint = await Painting.findOneAndUpdate({ _id: paintingId }, body, { new: true, runValidators: true });
      if (!paint) {
        return res.status(404).send({
          status: "Error",
          message: "Resource Not Found: We couldn't find the requested page or resource."
        });
      }
      return res.status(200).send({
        status: "Success",
        paint
      });
    } catch (err) {
      return res.status(500).send({
        status: "Error",
        message: "Internal Server Error: An unexpected error occurred."
      });
    }
  },
  delete: async (req, res) => {
    const paintingId = req.params.id;
    try {
      let imageData = await Painting.findById(paintingId);
      if (imageData.image0url) {
        let dataLength = imageData.image0url.split(".");
        let imageName = dataLength[dataLength.length - 2].split("/").pop();
        await cloudinary.uploader.destroy(imageName);
      }
      if (imageData.image1url) {
        let dataLength = imageData.image1url.split(".");
        let imageName = dataLength[dataLength.length - 2].split("/").pop();
        await cloudinary.uploader.destroy(imageName);
      }
      if (imageData.image2url) {
        let dataLength = imageData.image2url.split(".");
        let imageName = dataLength[dataLength.length - 2].split("/").pop();
        await cloudinary.uploader.destroy(imageName);
      }
      const paint = await Painting.findOneAndDelete({ _id: paintingId });
      if (!paint) {
        return res.status(404).send({
          status: "Error",
          message: "Resource Not Found: We couldn't find the requested page or resource."
        });
      }
      return res.status(200).send({
        status: "Success",
        paint
      });
    }
    catch (err) {
      return res.status(500).send({
        status: "Error",
        message: "Internal Server Error: An unexpected error occurred."
      });
    }
  },
  deleteImage: async (req, res) => {
    const paintingId = req.body.id;
    const id = req.body.index;
    try {
      let imageData = await Painting.findById(paintingId);
      let dataLength = imageData[`image${id}url`].split(".");
      let imageName = dataLength[dataLength.length - 2].split("/").pop();
      await cloudinary.uploader.destroy(imageName);

      const paint = await Painting.findOneAndUpdate({ _id: paintingId }, { [`image${id}url`]: null }, { new: true });
      if (!paint) {
        return res.status(404).send({
          status: "Error",
          message: "Resource Not Found: We couldn't find the requested page or resource."
        });
      }
      return res.status(200).send({
        status: "Success",
        paint
      });
    }
    catch (err) {
      return res.status(500).send({
        status: "Error",
        message: "Internal Server Error: An unexpected error occurred."
      });
    }
  },
  search: async (req, res) => {
    const searchTerm = req.query.search;
    try {
      const paints = await Painting.find({
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { subtitle: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      });
      return res.status(200).send({
        status: "Success",
        paints
      });
    } catch (err) {
      return res.status(500).send({
        status: "Error",
        message: "Internal Server Error: An unexpected error occurred."
      });
    }
  }
}

module.exports = controller;