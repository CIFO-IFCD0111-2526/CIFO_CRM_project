
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
    saveUninitialized: false, // no guarda sessions anònimes
    rolling: true, // para que se amplie la duracion de la cookie/sesson en cada petició
    cookie: {
            httpOnly: true, // si hem de treballar amb https , true, si no, false
            secure:  process.env.NODE_ENV === "production" ,// entenent que a production farem servir httpS
            maxAge: 6000000, // 100 minutos
            
        }
    }
))
/*  la IA me idce que esto es necesario ? ? 
// Necesario para procesar formularios POST
server.use(express.urlencoded({ extended: true }));
*/
const PORT = process.env.PORT || 3000;
// definim un port defecte o el del .env i comencem a escoltar 
server.listen(PORT, () => console.log("Servidor activo en http://localhost:" + PORT));