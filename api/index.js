const { connect, set } = require("mongoose");
const app = require("../app");
require('dotenv').config({ path: '.env' });
require("../controllers/instagramchecker");

set('strictQuery', false);
connect(process.env.URLMONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("La conexion a la base de datos fue exitosa.");
    const port = process.env.PORT || 3000;
    app.listen(port, () => { console.log(`El sevidor esta corriendo en el puerto ${port}.`); })
}).catch(() => {
    console.log("Ha ocurrido un error y la conexion ha fallado.");
}).finally(()=>{
    console.log("Se ha finalizado la promesa");
});

module.exports = app;