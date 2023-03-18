const request = require('postman-request');

const instagramChecker = setInterval(() => {
    request("https://backbirellogallery.vercel.app/apirest/token/625b1c29ac7355062c33afe1", (error, response, body) => {
        let token;
        if (response) {
            token = JSON.parse(response.body);
        }
        token = token.token.token;
        request(`https://graph.instagram.com/v1.0/17841403549294920/media?access_token=${token}&pretty=1&fields=caption%2Cmedia_url%2Cmedia_type%2Cpermalink%2Ctimestamp%2Cusername&limit=6`, (error, response, body) => {
            if (response.body === "Sorry, this content isn't available right now") {
                const data = {
                    name: 'Birello Gallery - Admin - ⚠⚠⚠⚠',
                    email: `${process.env.MAILDESTINY}`,
                    subject: '⚠⚠⚠⚠ ACTUALIZA EL TOKEN DE INSTAGRAM EN BIRELLO GALLERY ⚠⚠⚠⚠',
                    paint: 'No hay pintura seleccionada',
                    textarea: 'Este es un mensaje que te cree para que te avise cuando tenes que actualizar el token de instagram.',
                };
                request.post("https://backbirellogallery.vercel.app/apirest/formulario", {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
            }
        })
    });

}, 86400000);

module.exports = instagramChecker;


// 24hs = 86400000 ms