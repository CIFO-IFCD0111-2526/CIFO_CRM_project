const test = require('node:test');
const assert = require('node:assert');

const {
    validateDocument,
} = require('../../src/middlewares/validacionDocumento');

test('validateDocument existe', () => {
    assert.strictEqual(
        typeof validateDocument,
        'function'
    );
});

test('validateDocument devuelve 400 cuando la entidad no es válida', () => {
    const req = {
        params: {
            entidadTipo: 'Patata',
        },
    };

    let statusCode;
    let jsonResponse;

    const res = {
        status(code) {
            statusCode = code;
            return this;
        },
        json(data) {
            jsonResponse = data;
            return this;
        },
    };

    let nextCalled = false;

    const next = () => {
        nextCalled = true;
    };

    validateDocument(req, res, next);

    assert.strictEqual(statusCode, 400);
    assert.strictEqual(nextCalled, false);
    assert.strictEqual(jsonResponse.ok, false);
});

test('validateDocument ejecuta next cuando el documento es válido', () => {
    const req = {
        params: {
            entidadTipo: 'Alumno',
        },
        file: {
            mimetype: 'application/pdf',
            size: 1024,
        },
    };

    const res = {
        status() {
            return this;
        },
        json() {
            return this;
        },
    };

    let nextCalled = false;

    const next = () => {
        nextCalled = true;
    };

    validateDocument(req, res, next);

    assert.strictEqual(nextCalled, true);
});

test('validateDocument devuelve 400 cuando no se sube ningún fichero', () => {
    const req = {
        params: {
            entidadTipo: 'Alumno',
        },
    };

    let statusCode;
    let jsonResponse;

    const res = {
        status(code) {
            statusCode = code;
            return this;
        },
        json(data) {
            jsonResponse = data;
            return this;
        },
    };

    let nextCalled = false;

    const next = () => {
        nextCalled = true;
    };

    validateDocument(req, res, next);

    assert.strictEqual(statusCode, 400);
    assert.strictEqual(nextCalled, false);
    assert.strictEqual(jsonResponse.ok, false);
});

test('validateDocument devuelve 400 para un MIME no permitido', () => {
    const req = {
        params: {
            entidadTipo: 'Alumno',
        },
        file: {
            mimetype: 'application/exe',
            size: 1024,
        },
    };

    let statusCode;
    let jsonResponse;

    const res = {
        status(code) {
            statusCode = code;
            return this;
        },
        json(data) {
            jsonResponse = data;
            return this;
        },
    };

    let nextCalled = false;

    const next = () => {
        nextCalled = true;
    };

    validateDocument(req, res, next);

    assert.strictEqual(statusCode, 400);
    assert.strictEqual(nextCalled, false);
    assert.strictEqual(jsonResponse.ok, false);
});

test('validateDocument devuelve 400 cuando el fichero supera los 10MB', () => {
    const req = {
        params: {
            entidadTipo: 'Alumno',
        },
        file: {
            mimetype: 'application/pdf',
            size: 11 * 1024 * 1024,
        },
    };

    let statusCode;
    let jsonResponse;

    const res = {
        status(code) {
            statusCode = code;
            return this;
        },
        json(data) {
            jsonResponse = data;
            return this;
        },
    };

    let nextCalled = false;

    const next = () => {
        nextCalled = true;
    };

    validateDocument(req, res, next);

    assert.strictEqual(statusCode, 400);
    assert.strictEqual(nextCalled, false);
    assert.strictEqual(jsonResponse.ok, false);
});