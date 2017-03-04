
    
    const eelog = require('ee-log');
    const logd = require('./');


    const Transport = require('./lib/Transport');
    const ConsoleTransport = class extends Transport {
        message(message) {
            eelog(message);
        }
    }



    logd.transport(new ConsoleTransport().level('info+'));



    const a = require('./a');
    const b = require('./b');

