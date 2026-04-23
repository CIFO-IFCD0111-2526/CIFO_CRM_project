// Pintar el dashboard

const dashboardPrint = async (req, res) => {
  res.render("dashboard", {
    titulo: "Inici" /* ¿¿ tauler de control, Pagina principal ?? */,
    usuario: req.session.usuario,
    css: "dashboard.css",
    js: "dashboard.js",
    paginaActual: "dashboard",
  });
};

module.exports = { dashboardPrint };
