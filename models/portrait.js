const {Schema, model} = require('mongoose');

var PortadaSchema = Schema({
    titulo: String,
    image0url: String,
    date: { type: Date, default: Date.now }

});

module.exports = model("Portada", PortadaSchema);
