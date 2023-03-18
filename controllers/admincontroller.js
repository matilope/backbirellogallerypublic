var Admin = require('../models/admin');

var administration = {
    
getUsers: (req, res) => {

    var query = Admin.find({});

    var last = req.params.last;
    if (last || last != undefined) {
        query.limit(20);
    }

    // Find
    query.sort("-_id").exec((err, users) => {

        if (err) {
            return res.status(500).send({
                status: "Error",
                message: "Error al devolver los usuarios registrados"
            });
        }

        if (!users) {
            return res.status(404).send({
                status: "Error",
                message: "No hay usuarios para mostrar"
            });
        }

        return res.status(200).send({
            status: "Success",
            users
        });

    });
},

deleteUser: (req, res) => {

    var userId = req.params.id;

    Admin.findOneAndDelete({ _id: userId }, (err, userRemoved) => {
        if (err) {
            return res.status(500).send({
                status: "Error",
                message: "Error al borrar"
            });
        }

        if (!userRemoved) {
            return res.status(404).send({
                status: "Error",
                message: "No se ha borrado el usuario, posiblemente no exista"
            });
        }

        return res.status(200).send({
            status: "Success",
            users: userRemoved
        });

    });
}

}

module.exports = administration;