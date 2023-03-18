var Portrait = require('../models/portrait');
var cloudinary = require("cloudinary").v2;

cloudinary.config({ cloud_name: process.env.CLOUD_NAME, api_key: process.env.API_KEY, api_secret: process.env.API_SECRET });

var Header = {

    getPortraits: (req, res) => {

        var query = Portrait.find({});

        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(10);
        }

        query.sort("-_id").exec((err, portrait) => {

            if (err) {
                return res.status(500).send({
                    status: "Error",
                    message: "Error al devolver las pinturas"
                });
            }

            if (!portrait) {
                return res.status(404).send({
                    status: "Error",
                    message: "No hay pinturas para mostrar"
                });
            }

            return res.status(200).send({
                status: "Success",
                portrait
            });

        });
    },

    getPortrait: (req, res) => {

        var portraitId = req.params.id;

        if (!portraitId || portraitId == null) {
            return res.status(404).send({
                status: "Error",
                message: "No existe la portada"
            });
        }

        Portrait.findById(portraitId, (err, portrait) => {
            if (err || !portrait) {
                return res.status(404).send({
                    status: "Error",
                    Message: "No existe la portada"
                });
            }
            return res.status(200).send({
                status: "Success",
                portrait
            });
        });
    },

    updatePortrait: (req, res) => {

        var portraitId = req.params.id;
        var params = req.body;
      
         Portrait.findOneAndUpdate({ _id: portraitId }, params, { new: true }, (err, portraitUpdate) => {
                if (err) {
                    return res.status(500).send({
                        status: "Error",
                        Message: "Error al actualizar"
                    })
                }
                if (!portraitUpdate) {
                    return res.status(404).send({
                        status: "Error",
                        Message: "No existe el header"
                    })
                }
                return res.status(200).send({
                    status: "Success",
                    portrait: portraitUpdate
                });
            });
    },

    uploadPortrait: async (req, res) => {

        var array = [];

        let options = {
            upload_preset:"portada",
            unique_filename:true,
            use_filename:true,
            overwrite:true,
            public_id:`${req.files.file0.originalFilename.split(".")[0]}`,
        }
        
            await cloudinary.uploader.upload(req.files.file0.path, options, (err, result) => {
                array.push(result);
            });

            const obj = {
                status: 'Success',
                titulo: 'Header image',
            }
            array.map((_n, index) => {
                obj[`image${index}url`] = array[index].secure_url
            })
            return res.status(200).send(obj);
    }
}

module.exports = Header;