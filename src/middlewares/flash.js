function flash (req, res, next) {
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
};

module.exports = flash;