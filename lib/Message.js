{
    'use strict';


    const assert = require('assert');
    const Callsite = require('./Callsite');



    // the singleton nanalyzer
    // can eb used as singleton
    const callsite = new Callsite();





    module.exports = class Message {

        constructor(type) {
            assert(typeof type === 'string', 'the type must be a string');
            assert(type.length, 'the type must be a string with non zero length!');

            this.type = type;

            // a message may contain several junks of data
            this.data = [];
        }







        /**
        * set the callsite of the originator
        *
        * @param {object} frame v8 callsit object
        *
        * @returns {object} this
        */
        setCallSite(frame) {
            return callsite.convertStackFrame(frame);
        }







        /**
        * define the level of this message
        *
        * @param {object} level the level definition
        *
        * @returns {object} this
        */
        setLevel(level) {
            this.level = level;
            return this;
        }








        /**
        * stores a junks of data on the message
        *
        * @param {*} data the data to add
        *
        * @returns {object} this
        */
        addData(data) {
            this.data.push(data);
            return this;
        }
    }
}