{
    'use strict';



    const assert    = require('assert');
    const Callsite  = require('./Callsite');



    // the singleton nanalyzer
    // can eb used as singleton
    const callsite = new Callsite();






    module.exports = class ErrorMessage {



        constructor(err) {
            assert(err instanceof Error, 'expected an error object');

            this.name       = err.name;
            this.message    = err.message;
            this.frames     = callsite.getFromError(err).map(frame => callsite.convertStackFrame(frame));
        }
    }
}