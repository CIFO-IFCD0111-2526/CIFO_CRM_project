
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




const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Servidor activo en http://localhost:" + PORT));