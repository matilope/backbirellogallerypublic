var validator = require('validator');

var Pintura = require('../models/paints');

var cloudinary = require("cloudinary").v2;

cloudinary.config({ cloud_name: process.env.CLOUD_NAME, api_key: process.env.API_KEY, api_secret: process.env.API_SECRET });

const url = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/`;

var controller = {

    save: (req, res) => {

        var params = req.body;
        try {
            var validate_titulo = !validator.isEmpty(params.titulo);
            var validate_descripcion = !validator.isEmpty(params.descripcion);
            var validate_dimension = !validator.isEmpty(params.dimension);
            var validate_characteristics = !validator.isEmpty(params.characteristics);
            var validate_link = !validator.isEmpty(params.link);
        } catch (err) {
            return res.status(200).send({
                status: "Error",
                message: "Faltan datos por enviar"
            });
        }
        if (validate_titulo && validate_descripcion && validate_dimension && validate_characteristics && validate_link) {
            var paints = new Pintura();
            paints.titulo = params.titulo;
            paints.subtitulo = params.subtitulo;
            paints.descripcion = params.descripcion;
            paints.dimension = params.dimension;
            paints.characteristics = params.characteristics;
            paints.link = params.link;
            paints.link2 = params.link2;
            paints.image0url = params.image0url;
            paints.image1url = params.image1url;
            paints.image2url = params.image2url;
            paints.image3url = params.image3url;
            paints.image4url = params.image4url;
            paints.image5url = params.image5url;

            paints.save((err, paintStored) => {
                if (err || !paintStored) {
                    return res.status(404).send({
                        status: "Error",
                        message: "No se ha guardado"
                    });
                }


                return res.status(200).send({
                    status: "Success",
                    paints: paintStored
                });
            });

        } else {

            return res.status(200).send({
                status: "Error",
                message: "Los datos no son validos"
            });
        }
    },

    getPinturas: (req, res) => {

        var query = Pintura.find({});

        // '_id'
        query.sort({
            _id: 'desc'
        }).exec((err, paints) => {

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

            paints = paints.slice(startIndex, endIndex)


            if (err) {
                return res.status(500).send({
                    status: "Error",
                    message: "Error al devolver las pinturas"
                });
            }

            if (!paints) {
                return res.status(404).send({
                    status: "Error",
                    message: "No hay pinturas para mostrar"
                });
            }

            return res.status(200).send({
                status: "Success",
                paints,
                results
            });

        });

    },

    getPintura: (req, res) => {

        var pinturaId = req.params.id;

        if (!pinturaId || pinturaId == null) {
            return res.status(404).send({
                status: "Error",
                message: "No existe la pintura"
            });
        }

        Pintura.findById(pinturaId, (err, paints) => {
            if (err || !paints) {
                return res.status(404).send({
                    status: "Error",
                    Message: "No existe la pintura"
                });
            }
            return res.status(200).send({
                status: "Success",
                paints
            });
        });
    },

    update: (req, res) => {
        var pinturaId = req.params.id;
        var params = req.body;

        try {
            var validate_titulo = !validator.isEmpty(params.titulo);
            var validate_descripcion = !validator.isEmpty(params.descripcion);
            var validate_dimension = !validator.isEmpty(params.dimension);
            var validate_characteristics = !validator.isEmpty(params.characteristics);
            var validate_link = !validator.isEmpty(params.link);

        } catch (err) {
            return res.status(200).send({
                status: "Error",
                Message: "Faltan datos por enviar"
            });
        }

        if (validate_titulo && validate_descripcion && validate_dimension && validate_characteristics && validate_link) {
            Pintura.findOneAndUpdate({
                _id: pinturaId
            }, params, {
                new: true
            }, (err, pinturaUpdate) => {
                if (err) {
                    return res.status(500).send({
                        status: "Error",
                        Message: "Error al actualizar"
                    })
                }
                if (!pinturaUpdate) {
                    return res.status(404).send({
                        status: "Error",
                        Message: "No existe la pintura"
                    })
                }
                return res.status(200).send({
                    status: "Success",
                    paints: pinturaUpdate
                });
            });

        } else {
            return res.status(200).send({
                status: "Error",
                Message: "La validacion no es correcta"
            });
        }
    },

    delete: async (req, res) => {

        var pinturaId = req.params.id;

        let data = await Pintura.findById(req.params.id);

        let public_id = [];

        if (data.image0url) {
            if (data.image0url.length > 1) {
                public_id.push(data.image0url.split(url)[1].split("/")[1].split(".webp")[0]);
            }
        }

        if (data.image1url) {
            if (data.image1url.length > 1) {
                public_id.push(data.image1url.split(url)[1].split("/")[1].split(".webp")[0]);
            }
        }

        if (data.image2url) {
            if (data.image2url.length > 1) {
                public_id.push(data.image2url.split(url)[1].split("/")[1].split(".webp")[0]);
            }
        }

        if (data.image3url) {
            if (data.image3url.length > 1) {
                public_id.push(data.image3url.split(url)[1].split("/")[1].split(".webp")[0]);
            }
        }

        if (data.image4url) {
            if (data.image4url.length > 1) {
                public_id.push(data.image4url.split(url)[1].split("/")[1].split(".webp")[0]);
            }
        }

        if (data.image5url) {
            if (data.image5url.length > 1) {
                public_id.push(data.image5url.split(url)[1].split("/")[1].split(".webp")[0]);
            }
        }

        public_id.forEach(e => {
            cloudinary.uploader.destroy(e, function (error, result) { });
        })


        Pintura.findOneAndDelete({
            _id: pinturaId
        }, (err, pinturaRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: "Error",
                    message: "Error al borrar"
                });
            }

            if (!pinturaRemoved) {
                return res.status(404).send({
                    status: "Error",
                    message: "No se ha borrado la pintura, posiblemente no exista"
                });
            }

            return res.status(200).send({
                status: "Success",
                paints: pinturaRemoved
            });

        });
    },

    create: async (req, res) => {

        var imageloop = [];

        if (req.files) {
            Object.keys(req.files).map(key => {
                if (req.files[key] !== undefined && key.includes('file')) {
                    imageloop.push(req.files[key]);
                }
            });
        }

        var array = [];

        let options = {
            upload_preset: "pinturas",
            unique_filename: true,
            use_filename: true,
            overwrite: true,
        }

        for (let i = 0; i < imageloop.length; i++) {
            options.public_id = `${imageloop[i].originalFilename.split(".")[0]}`;
            await cloudinary.uploader.upload(imageloop[i].path, options, (err, result) => {
                array.push(result);
            });
        }

        const obj = {
            status: 'Success',
        }
        array.map((_n, index) => {
            obj[`image${index}url`] = array[index].secure_url
        })
        return res.status(200).send(obj);

    },

    deleteImage: async (req, res) => {

        let params = JSON.parse(req.body.params);

        var pinturaId = params._id;

        let public_id = [];

        if (params.image0url) {
            if (params.image0url.length > 1 && req.body.index == 0) {
                public_id.push(params.image0url.split(url)[1].split("/")[1].split(".webp")[0]);
                params.image0url = "";
            }
        }

        if (params.image1url) {
            if (params.image1url.length > 1 && req.body.index == 1) {
                public_id.push(params.image1url.split(url)[1].split("/")[1].split(".webp")[0]);
                params.image1url = "";
            }
        }

        if (params.image2url) {
            if (params.image2url.length > 1 && req.body.index == 2) {
                public_id.push(params.image2url.split(url)[1].split("/")[1].split(".webp")[0]);
                params.image2url = "";
            }
        }

        if (params.image3url) {
            if (params.image3url.length > 1 && req.body.index == 3) {
                public_id.push(params.image3url.split(url)[1].split("/")[1].split(".webp")[0]);
                params.image3url = "";
            }
        }

        if (params.image4url) {
            if (params.image4url.length > 1 && req.body.index == 4) {
                public_id.push(params.image4url.split(url)[1].split("/")[1].split(".webp")[0]);
                params.image4url = "";
            }
        }

        if (params.image5url) {
            if (params.image5url.length > 1 && req.body.index == 5) {
                public_id.push(params.image5url.split(url)[1].split("/")[1].split(".webp")[0]);
                params.image5url = "";
            }
        }

        public_id.forEach(e => {
            cloudinary.uploader.destroy(e, function (error, result) { });
        })

        let index = JSON.parse(req.body.index);

        const obj = {
            status: "Success",
        }
        obj[`image${index}url`] = "";

        if (pinturaId) {
            await Pintura.findOneAndUpdate({
                _id: pinturaId
            }, params, {
                new: true
            }, (err, paintUpdated) => {
                if (err || !paintUpdated) {
                    return res.status(404).send({
                        status: "Error",
                        message: "Error al eliminar la imagen",
                    });
                }

                return res.status(200).send({
                    status: "Success",
                    paints: paintUpdated,
                });
            }).clone();
        } else {
            return res.status(200).send(obj);
        }

    }

}

module.exports = controller;