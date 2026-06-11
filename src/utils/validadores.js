/**
 * Validadors compartits de backend.
 * La lògica de DNI/NIE/CIF és la mateixa que fa servir el front
 * (src/public/js/alumnos.js) per validar el formulari d'alta d'alumne.
 */

/**
 * Valida DNI (NIF), CIF o NIE.
 * @param {string} dni Número d'identificació
 * @returns {boolean} true si és vàlid
 */
function validDniCifNie(dni) {
    dni = String(dni || "").toUpperCase();
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";

    // Validació de format general
    if (!/^[A-Z0-9]{9}$/.test(dni)) {
        return false;
    }

    // NIF estàndard (8 números + 1 lletra)
    if (/^[0-9]{8}[A-Z]$/.test(dni)) {
        const numero = parseInt(dni.slice(0, 8), 10);
        return dni[8] === letras[numero % 23];
    }

    // NIE (X, Y, Z seguit de 7 números i una lletra)
    if (/^[XYZ][0-9]{7}[A-Z]$/.test(dni)) {
        const reemplazo = { X: "0", Y: "1", Z: "2" };
        const numero = reemplazo[dni[0]] + dni.slice(1, 8);
        return dni[8] === letras[parseInt(numero, 10) % 23];
    }

    // CIF (lletra + 7 números + lletra/número)
    if (/^[ABCDEFGHJNPQRSUVW][0-9]{7}[A-Z0-9]$/.test(dni)) {
        let sumaPar = 0;
        let sumaImpar = 0;

        for (let i = 1; i <= 6; i += 2) {
            sumaPar += parseInt(dni[i], 10);
        }

        for (let i = 0; i <= 6; i += 2) {
            const doble = parseInt(dni[i], 10) * 2;
            sumaImpar += doble > 9 ? doble - 9 : doble;
        }

        const control = (10 - ((sumaPar + sumaImpar) % 10)) % 10;
        const controlEsperado = dni[8];

        if (/[A-Z]/.test(controlEsperado)) {
            return controlEsperado === String.fromCharCode(64 + control);
        }
        return parseInt(controlEsperado, 10) === control;
    }

    // NIE especial (T seguit de 8 dígits)
    if (/^T[0-9]{8}$/.test(dni)) {
        return true;
    }

    return false;
}

/**
 * Valida el format bàsic d'un email.
 * @param {string} email
 * @returns {boolean} true si és vàlid
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

module.exports = { validDniCifNie, isValidEmail };
