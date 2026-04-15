
//             por hora no hacen falta, aun  que nos vendrá bien.
// const path = require("path");
// const cookieParser = require("cookie-parser");


require('dotenv').config({ path: "../.env"}); // per fer servir dades del .env
require("./mysql_conn.js"); 

const express = require("express");
//console.log(process.env.PORT)



// View Engine Setup
const server = new express(); // creem el servidor 
// li diem que faci servir ejs com a viewer amb les vistes de ./views
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname,'views')); 


// servir estáticos desde public
server.use(express.static(path.join(__dirname, "public")));

// https://www.npmjs.com/package/express-session
// info sobre el use de session , que s'haurà de configurar
server.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: function(req) {
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
server.listen(PORT, () => console.log("Servidor activo en http://localhost:" + PORT));