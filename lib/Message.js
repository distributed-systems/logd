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
        * lets the user mark the message withan uid
        *
        * @param {string} uid
        *
        * @returns {object} this
        */
        setUId(uid) {
            this.uid = uid;
            return this;
        }



        /**
        * set the callsite of the originator
        *
        * @param {object} frame v8 callsit object
        *
        * @returns {object} this
        */
        setCallSite(frame) {
            this.callsite = callsite.convertStackFrame(frame);
            return this;
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
        * returns the level this message is intended for
        *
        * @returns {number} level
        */
        getLevelNumber() {
            return this.level.level;
        }







        /**
        * stores a junks of data on the message
        *
        * @param {*} data the data to add
        *
        * @returns {object} this
        */
        addData(data) {
            this.data.push({
                  type: 'data'
                , data: data
            });
            return this;
        }







        /**
        * stores a junks of data on the message
        * the junks has already a type
        *
        * @param {*} data the data to add
        *
        * @returns {object} this
        */
        addDataObject(data) {
            this.data.push(data);
            return this;
        }
    }
}