const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");
const documentoController = require("../controllers/documentoController");
const { validateDocument } = require("../middlewares/validacionDocumento.js");

const router = Router();

router.use(authPage);

router.post( "/:entidadTipo/:entidadId" , documentoController.uploadMiddleware , validateDocument , documentoController.uploadDocument );

module.exports = router;