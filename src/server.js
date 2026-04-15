
//             por hora no hacen falta, aun  que nos vendrá bien.
// const cookieParser = require("cookie-parser");
const path = require("path");
var session = require('express-session'); // per fer servir 
require('dotenv').config({ path: `${path.join(__dirname,"..",".env")}` }); // per fer servir dades del .env //  habria que usar el path.join
// require(`${path.join("MONTAR AQUI PARA LLEGAR A LOS MIDDLEWARE ")}`);  

const express = require("express");
const server = new express(); // creem el servidor

// li diem que faci servir ejs com a viewer amb les vistes de ./views
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));


// servir estáticos desde public
server.use(express.static(path.join(__dirname, "public")));

// https://www.npmjs.com/package/express-session
// info sobre el use de session , que s'haurà de llegir bé i 
// configurar
server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: function (req) {
        var match = req.url.match(/^\/([^/]+)/); // no sé para qué sirve
        return {
            path: match ? '/' + match[1] : '/',
            httpOnly: true, // si hem de treballar amb https , true, si no, false
            secure: req.secure || false,
            maxAge: 60000,
            rolling: true // para que se amplie la duracion de la cookie/sesson en cada petició
        }
    }
}))



const PORT = process.env.PORT || 3000;
// definim un port defecte o el del .env i comencem a escoltar 
server.listen(PORT, () => console.log("Servidor activo en http://localhost:" + PORT));