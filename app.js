// Require de paquetes
const express = require("express");
const app = express();
const cors = require('cors');
require('dotenv').config({ path: '.env' });

// Cargar archivos rutas
const paints = require("./routes/paints");
const admin = require("./routes/user");
const contact = require("./routes/contact");
const portrait = require("./routes/portrait");
const instagram = require("./routes/instagram");

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

const whitelist = ["http://birellogallery.com", "https://birellogallery.com", "http://www.birellogallery.com", "https://www.birellogallery.com", "http://localhost:4200"];
const corsOptions = {
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
app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Welcome to the Birello Gallery API'
  });
});
app.use("/api", paints);
app.use("/api", admin);
app.use("/api", contact);
app.use("/api", portrait);
app.use("/api", instagram);

module.exports = app;