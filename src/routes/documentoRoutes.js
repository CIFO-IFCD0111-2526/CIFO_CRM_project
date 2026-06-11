const { Router } = require("express");
const { authPage, requireEditor } = require("../middlewares/auth.js");
const documentoController = require("../controllers/documentoController");
const { validateDocument } = require("../middlewares/validacionDocumento.js");

const router = Router();

router.use(authPage);

// Pujar i esborrar documents requereix editor o admin; veure i descarregar és obert a tothom autenticat.
router.post( "/:entidadTipo/:entidadId" , requireEditor , documentoController.uploadMiddleware , validateDocument , documentoController.uploadDocument );
router.get( "/:entidadTipo/:entidadId",documentoController.getDocuments);
router.get( "/:entidadTipo/:entidadId/:id/descarregar",documentoController.downloadDocument);
router.delete("/:id", requireEditor, documentoController.deleteDocument);

module.exports = router;
