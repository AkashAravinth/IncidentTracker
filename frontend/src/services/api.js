import axios from 'axios';

// the extension locahost:8000 is not needed to be specified as the proxy is not set in the package.json .

const api = axios.create({
    baseURL: 'http://localhost:8000',
    // baseURL: 'http://backend:8000',
});

// export default
// A module can have only one default export.
// When importing, you do not use curly braces {}.
// You can import the default export with any name you choose.
// Useful when the file exports a single main value

// Named export (normal export)
// A module can have multiple named exports.
// When importing, you must use curly braces {}.
// You must use the exact exported name, but you can rename while importing using as.
// Used to export multiple values from the same file.

export default api;