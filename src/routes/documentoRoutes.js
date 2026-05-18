const { Router } = require("express");
const { authPage } = require("../middlewares/auth.js");
const documentoController = require("../controllers/documentoController");
const { validateDocument } = require("../middlewares/validacionDocumento.js");

const router = Router();

router.use(authPage);

router.post( "/:entidadTipo/:entidadId" , documentoController.uploadMiddleware , validateDocument , documentoController.uploadDocument );
router.get( "/:entidadTipo/:entidadId",documentoController.getDocuments);
router.get( "/:entidadTipo/:entidadId/:id/descarregar",documentoController.downloadDocument);
router.delete("/:id",documentoController.deleteDocument);

module.exports = router;
