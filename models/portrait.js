const {Schema, model} = require('mongoose');

var PortraitSchema = Schema({
    title: {
        type: String,
        required: true
    },
    image0url: {
        type: String,
        required: true
    },
    date: { type: Date, default: Date.now }
});

module.exports = model("Portrait", PortraitSchema);
