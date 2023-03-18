var express = require("express");
var router = express.Router();
const validator = require("validator");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");

// Limit request on form

const accountLimiter = rateLimit({
  windowMs: 60 * 60 * 24000, // 24 hour window
  max: 3, // start blocking after 3 requests
  message:
    "We received too many forms from this IP, please try again after an hour"
});

// Contact section

router.post("/formulario", accountLimiter, (req, res) => {

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASSWORD
      }
    });

    if (!validator.isEmpty(req.body.name && req.body.email && req.body.subject && req.body.textarea && req.body.paint)) {
      const mailOptions = {
        from: `"Birello Gallery" ${process.env.MAILDESTINY}`,
        to: `${process.env.MAILDESTINY}`,
        subject: `${req.body.subject}`,
        html: `<ul style="line-height:30px;"><li><strong>Name: </strong>${req.body.name}</li><li><strong>Subject: </strong>${req.body.subject}</li><li><strong>Email: </strong>${req.body.email}</li><li><strong>Option: </strong>${req.body.paint}</li><li><strong>Message: </strong>${req.body.textarea}</li></ul>`
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          // console.log(error);
        } else {
          // console.log('Email enviado: ' + info.response);
          res.status(200).json({
            message: 'Enviado exitosamente'
          })
        }
      });
    }
  }
);

module.exports = router;