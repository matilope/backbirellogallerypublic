const { Schema, model } = require('mongoose');

const PaintingSchema = Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dimension: {
        type: String,
        required: true
    },
    characteristics: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: false
    },
    link2: {
        type: String,
        required: false
    },
    image0url: {
        type: String,
        required: true
    },
    image1url: {
        type: String,
        required: false
    },
    image2url: {
        type: String,
        required: false
    },
    date: { type: Date, default: Date.now }
});

module.exports = model("Painting", PaintingSchema);
