'use strict';

const Transport = require('./src/Transport');
const Logd = require('./src/Logd');

// just one instance per process
// needed for linked modules
if (!process.__logd_instance) {
    process.__logd_instance = new Logd();
}

// export it from the module
module.exports = process.__logd_instance;
module.exports.Transport = Transport;
