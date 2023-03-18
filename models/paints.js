const {Schema, model} = require('mongoose');

var PinturasSchema = Schema({
    titulo: String,
    subtitulo: String,
    image0url: String,
    image1url: String,
    image2url: String,
    image3url: String,
    image4url: String,
    image5url: String,
    descripcion: String,
    dimension: String,
    characteristics: String,
    link: String,
    link2: String,
    date: { type: Date, default: Date.now }
});

module.exports = model("Pintura", PinturasSchema);
