const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");
const authPage = require("../middlewares/authPage");

router.get("/perfil", authPage, usuarioController.perfil);

router.put(
    "/perfil/password",
    authPage,
    usuarioController.changePassword
);