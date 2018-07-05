{
    'use strict';

    const assert = require('assert');





    module.exports = class Transport {


        constructor() {

            // level descriptor storage
            this.levels = [{
                  type: 'number-range'
                , from: 0
                , to: 100
                , default: true
            }];

            // locked status. if the transport is locked
            // the levels cannot be changed anymore
            this.locked = false;
        }









        /**
        * got a message, got to do something with it
        *
        * @param {object} message
        */
        message(message) {
            throw new Error('the message method was not implemented!');
        }











        /**
        * lock the transport so that the levels 
        * cannot be edited anymore
        *
        * @returns {obejct} this
        */
        lock() {
            this.locked = true;
        }












        /**
        * returns the level descriptors
        *
        * @returns {array} levels
        */
        getLevels() {
            return this.levels;
        }











        /**
        * enables certain levels on this transport
        *
        * @param {string} levels one or more level stings
        *
        * @returns {object} this
        */
        level(...levels) {
            assert(!this.locked, 'cannot add level, the transport was registered on the logd instance and cannot modified anymore!');

            // remove the default
            if (this.levels[0].default) this.levels.shift();


            levels.forEach((level) => {
                level.split(/\s*,\s*/gi).forEach((subLevel) => {
                    const parts = /^([a-z0-9]+)([\+\-])([a-z0-9]*)$/gi.exec(subLevel.trim().toLowerCase());
                    assert(parts && parts.length && parts[1] && parts[1].length, `invalid level expression ${level}, failed to parse ${subLevel}. allowed epressions are 'level', 'level-', 'level+', 'level-', 'level-level' and identifiers that contain a-z, 0-9!`);
                    
                    if (parts[3]) {
                        
                        // range expression
                        assert(parts[2] === '-', `expected level expression 'level-level', got '${subLevel}' instead!`);
                        this.levels.push({
                              type: 'range'
                            , from: parts[1]
                            , to: parts[3]
                        });
                    } else if (parts[2]) {

                        // open range expression
                        this.levels.push({
                              type: 'open-range'
                            , name: parts[1]
                            , modifier: parts[2]
                        });
                    } else {

                        // single expression
                        this.levels.push({
                              type: 'level'
                            , name: parts[1]
                        });
                    }
                });
            });


            return this;
        }
    }
}
