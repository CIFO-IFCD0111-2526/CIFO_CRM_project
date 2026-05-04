function flash (req, res, next) {
  res.locals.flash = req.session.flash || null;
  console.log(res.locals.flash);

  if ( !req.session.flash?.keepModal ) {
  delete req.session.flash;
  } else { 
    req.session.flash.keepModal = false 
  };

  next();
};

module.exports = { flash };