'use strict';


const Transport = require('../../src/Transport');


module.exports = class TestTransport extends Transport {


    constructor() {
        super();

        this.promise = new Promise((resolve) => {
            this.resolve = resolve;
        });

        this.timeout = setTimeout(() => {
            this.resolve('Timeout on TestTransport, no message received!');
        }, 1000);
    }



    getMessage() {
        return this.promise;
    }


    message(message) {
        process.nextTick(() => {
            this.resolve(message);
            clearTimeout(this.timeout);
        });
    }
}