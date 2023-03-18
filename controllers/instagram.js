var Token = require('../models/instagram');
var validator = require('validator');

var controller = {

    saveToken: (req, res) => {
        var params = req.body;
        try {
            var validate_token = !validator.isEmpty(params.token);
        } catch (err) {
            return res.status(200).send({
                status: "Error",
                message: "Faltan datos por enviar"
            });
        }
        if (validate_token) {
            var token = new Token();
            token.token = params.token;
            token.save((err, tokenStored) => {
                if (err || !tokenStored) {
                    return res.status(404).send({
                        status: "Error",
                        message: "No se ha guardado el token"
                    });
                }
                return res.status(200).send({
                    status: "Success",
                    token: tokenStored
                });
            });
        } else {
            return res.status(200).send({
                status: "Error",
                message: "Los datos no son validos"
            });
        }
    },

    getTokens: (req, res) => {

        var query = Token.find({});

        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(10);
        }

        query.sort("-_id").exec((err, token) => {

            if (err) {
                return res.status(500).send({
                    status: "Error",
                    message: "Error al devolver los tokens"
                });
            }

            if (!token) {
                return res.status(404).send({
                    status: "Error",
                    message: "No hay tokens para mostrar"
                });
            }

            return res.status(200).send({
                status: "Success",
                token
            });

        });
    },

    getToken: (req, res) => {

        var tokenId = req.params.id;

        if (!tokenId || tokenId == null) {
            return res.status(404).send({
                status: "Error",
                message: "No existe el token"
            });
        }

        Token.findById(tokenId, (err, token) => {
            if (err || !token) {
                return res.status(404).send({
                    status: "Error",
                    Message: "No existe el token"
                });
            }
            return res.status(200).send({
                status: "Success",
                token
            });
        });
    },

    updateToken: (req, res) => {

        var tokenId = req.params.id;
        var params = req.body;

        try {
            var validate_token = !validator.isEmpty(params.token);
        } catch (err) {
            return res.status(200).send({
                status: "Error",
                Message: "Faltan datos por enviar"
            });
        }

        if (validate_token) {
            Token.findOneAndUpdate({ _id: tokenId }, params, { new: true }, (err, tokenUpdate) => {
                if (err) {
                    return res.status(500).send({
                        status: "Error",
                        Message: "Error al actualizar"
                    })
                }
                if (!tokenUpdate) {
                    return res.status(404).send({
                        status: "Error",
                        Message: "No existe el token"
                    })
                }
                return res.status(200).send({
                    status: "Success",
                    token: tokenUpdate
                });
            });
        } else {
            return res.status(200).send({
                status: "Error",
                message: "Los datos no son validos"
            });
        }
    }
}

module.exports = controller;