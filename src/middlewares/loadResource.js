function loadResource(Modelo, options = {}) {
    const {
        paramName = "id",
        redirectTo,
        notFoundMessage = `${Modelo.name} no trobat.`,
        propName = Modelo.name.toLowerCase(),
        include,
    } = options;

    return async (req, res, next) => {
        try {
            const recurso = await Modelo.findByPk(req.params[paramName], { include });
            if (!recurso) {
                if (req.method === "GET") {
                    req.session.flash = {
                        type: "error",
                        title: "No trobat",
                        message: notFoundMessage,
                    };
                    return res.redirect(redirectTo);
                }
                return res.status(404).json({ ok: false, error: notFoundMessage });
            }
            req[propName] = recurso;
            next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = { loadResource };