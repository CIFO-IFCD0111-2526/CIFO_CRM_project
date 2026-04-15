
const path = require("path");
var session = require('express-session'); // per fer servir 
require('dotenv').config({ path: `${path.join(__dirname,"..",".env")}` }); // per fer servir dades del .env 


// pendiente de que exista el middleware
// require(`${path.join(__dirname,"src","middlewares", "auth.js")}`); 


const express = require("express");
const server = new express(); // creem el servidor

// li diem que faci servir ejs com a viewer amb les vistes de ./views
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));


// servir estáticos desde public
server.use(express.static(path.join(__dirname, "public")));
server.use(express.json());
server.use(express.urlencoded({ extended: true })); // extended ens permet enviar formularis


// https://www.npmjs.com/package/express-session
// info sobre el use de session , que s'haurà de llegir bé i 
// configurar
server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,   // no guarda sessions anònimes
    rolling: true,              // para que se amplie la duracion de la cookie/session en cada petició
    cookie: {
            httpOnly: true,    // para que JS de navegador no pueda leer la cookie, podria donar problenmes de seguretat. 
            secure:  process.env.NODE_ENV === "production" ,    // entenent que a production farem servir httpS
            maxAge: 120 * 60 * 1000, // 120  minutos en ms ( 2h )            
        }
    }
))



// pendiente de que exista 
// server.use("/", require( `${path.join(__dirname,"routes","index.js")}` ));


const PORT = process.env.PORT || 3000;
// definim un port defecte o el del .env i comencem a escoltar 
server.listen(PORT, () => console.log("Servidor activo en http://localhost:" + PORT));