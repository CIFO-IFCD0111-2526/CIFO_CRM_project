const test = require('node:test');
const assert = require('node:assert');

const {
  authPage,
  redirectIfLogged,
  requireAdmin,
} = require('../../src/middlewares/auth.js');

test('authPage -> redirigeix a /login si no hi ha usuari', () => {
  const req = { session: {} };

  let redirected = null;

  const res = {
    redirect(url) {
      redirected = url;
    },
  };

  authPage(req, res, () => {});

  assert.equal(redirected, '/login');
});

test('redirectIfLogged -> redirigeix a /dashboard si hi ha usuari', () => {
  const req = {
    session: { usuario: { id: 1 } },
  };

  let redirected = null;

  const res = {
    redirect(url) {
      redirected = url;
    },
  };

  redirectIfLogged(req, res, () => {});

  assert.equal(redirected, '/dashboard');
});

test('requireAdmin -> retorna 403 si no és admin', () => {
  const req = {
    session: { usuario: { nivel_acceso: 'editor' } },
  };

  let statusCode = null;

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json() {},
  };

  requireAdmin(req, res, () => {});

  assert.equal(statusCode, 403);
});