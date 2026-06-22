const test = require('node:test');
const assert = require('node:assert');

const {
    validDniCifNie,
    isValidEmail,
} = require('../../src/utils/validadores');

test('validDniCifNie existe', () => {
    assert.strictEqual(typeof validDniCifNie, 'function');
});

test('isValidEmail existe', () => {
    assert.strictEqual(typeof isValidEmail, 'function');
});

test('validDniCifNie devuelve true para un DNI válido', () => {
    assert.strictEqual(
        validDniCifNie('12345678Z'),
        true
    );
});

test('validDniCifNie devuelve false para un DNI con letra incorrecta', () => {
    assert.strictEqual(
        validDniCifNie('12345678A'),
        false
    );
});

test('validDniCifNie devuelve false para un valor vacío', () => {
    assert.strictEqual(
        validDniCifNie(''),
        false
    );
});

test('isValidEmail devuelve true para un email válido', () => {
    assert.strictEqual(
        isValidEmail('carlos@example.com'),
        true
    );
});

test('isValidEmail devuelve false para un email inválido', () => {
    assert.strictEqual(
        isValidEmail('carlos@'),
        false
    );
});

test('validDniCifNie devuelve false para un formato incorrecto', () => {
    assert.strictEqual(
        validDniCifNie('ABC'),
        false
    );
});

test('validDniCifNie devuelve false para null', () => {
    assert.strictEqual(
        validDniCifNie(null),
        false
    );
});