// Require de paquetes

const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require('cors');
require('dotenv').config({ path: '.env' });

// Cargar archivos rutas

const paints_routes = require("./routes/paints");
const admin_routes = require("./routes/administration");
const admin_sessions = require("./routes/adminsession");
const contact = require("./routes/contact");
const portrait = require("./routes/portraitroute");
const instagram = require("./routes/instagram");

// Middlewares

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// CORS

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

var whitelist = ["http://birellogallery.com", "https://birellogallery.com", "http://www.birellogallery.com", "https://www.birellogallery.com", "http://localhost:4200"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

// Routes section

app.use("/apirest", paints_routes);
app.use("/apirest", admin_routes);
app.use("/apirest", admin_sessions);
app.use("/apirest", contact);
app.use("/apirest", portrait);
app.use("/apirest", instagram);

module.exports = app;