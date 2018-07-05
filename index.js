'use strict';

const Transport = require('./src/Transport');
const Logd = require('./src/Logd');


// export it from the module
module.exports = new Logd();
module.exports.Transport = Transport;
