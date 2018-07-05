{
    'use strict';


    const assert            = require('assert');
    const uuidV4            = require('uuid/v4');

    const Callsite          = require('./Callsite');
    const TransportManager  = require('./TransportManager');
    const LogModule			= require('./LogModule');




    // the singleton nanalyzer
    // can eb used as singleton
    const callsite = new Callsite();








    const defaultLevels = [{
          name: 'debug'
        , level: 20
    }, {
          name: 'notice'
        , level: 35
    }, {
          name: 'info'
        , level: 50
    }, {
          name: 'warn'
        , level: 65
    }, {
          name: 'error'
        , level: 80
    }, {
          name: 'wtf'
        , level: 100
    }, {
          name: 'highlight'
        , level: 100
    }, {
          name: 'success'
        , level: 100
    }];









    module.exports = class Logd {




    	constructor() {


    		// the loglevels that are avilable
    		this.logLevels = defaultLevels.slice(0);


    		// map with path of all modules makign use of this module
 			this.pathMap = new Map();

 			// trnsport used for sending log messages to targets
            this.transportManager = new TransportManager(this);
                

    		// were retruning a function so that the user
    		// can print random stuff to the console
    		const instance = (...items) => {

    		}


            // need to be able to acces this instance 
            // from within functions 
            this.instance = instance;



            // check which log levels are enabled
            this.getEnabledLogLevels();  


    		// since it0s a bad idea to change the 
    		// prototype of any obejct we're manuall<
    		// implementing the methods on the returnes
    		// function. sind this is more or less
    		// a singleton the performance should be ok
    		instance.level = this.level.bind(this);
    		instance.transport = this.transport.bind(this);
            instance.module = this.module.bind(this);


            // the user should be able to create new isntances
            instance.createInstance = () => {
                return new Logd();
            }



    		// let the user work on the function 
    		// insted of this class
    		return instance;
    	}








        /**
        * finds the current log levels to handle from the 
        * processes arguments
        */
        getEnabledLogLevels() {
            this.levelFrom = 0;
            this.levelTo = 100;

            // check if the user passed a custom offset
            process.argv.forEach((arg) => {
                const parts = /^--l(:?og)?-level(:?:|=)(?:([0-9]+)|([a-z0-9]+))([\+\-]*)$/gi.exec(arg);
                if (parts) {
                    let level;
                    
                    if (parts[4] && this.logLevels.some(l => l.name === parts[4])) level = this.logLevels.find(l => l.name === parts[4]).level;
                    if (parts[3]) level = parseInt(parts[3], 10);

                    if (level !== undefined) {
                        if (parts[5] === '-') {
                            this.levelTo = level;
                            this.levelFrom = 0;
                        } else if (parts[5] === '+') {
                            this.levelFrom = level;
                            this.levelTo = 100;
                        } else {
                            this.levelFrom = level;
                            this.levelTo = level;
                        }
                    } else throw new Error(`Failed to determine loglevel, accepting level, level+, level-, number, got ${arg}`);
                }
            });

            this.instance.levelFrom = this.levelFrom;
            this.instance.levelTo = this.levelTo;
        }











        /**
        * handles log messages that were emitted
        *
        * @param {object} message the message to transmit
        */ 
        sendLogMessage(message) {
            this.getTransportManager().sendMessage(message);
        }









        /**
        * register a new log level on the module 
        * and its children if there are any
        *
        * @param {string} name the name fo the level
        * @param {number} level the integer level
        *
        * @returns {object} this
        */ 
        level(name, level = 50) {
            assert(name, 'Expected a name!');
            assert(typeof name === 'string', 'The name must be a string!')


            const levelDefinition = {name, level};


            // notify all children
            for (module of this.pathMap.values()) {
                module.addLoglevelHandler(levelDefinition);
            }


            // add to collection
            this.logLevels.push(levelDefinition);


            return this;
        }








        /**
        * add a transport module
        *
        * @param {object} transportIntance an instance of a transport
        *
        * @returns {object} this
        */
        transport(transport) {
            this.getTransportManager().add(transport);
            return this;
        }








        /**
        * returns the transport maneger
        *
        * @returns {object} transportmanager
        */
        getTransportManager() {
        	return this.transportManager;
        }








        /**
        * create a namespace for a module which can 
        * be separately controlled
        *
        * @param {string} moduleName the name of the module
        *
        * @returns {object} logger module
        */
        module(moduleName, dontBustCache) {
            const parentFiles = callsite.getParentFiles(1, Infinity);
            const modulePath = parentFiles[0];
            const rootModule = this;
            const logLevels = this.logLevels


            // bust the require cache
            // creepy, nbut it's a workaroudn for now
            if (!dontBustCache) delete require.cache[modulePath];


            // return a new logger instance
            const instance = new LogModule({moduleName, rootModule, parentFiles, logLevels});



            // add to map so it can be discovered later
            this.pathMap.set(modulePath, instance);


            return instance;
        }







        /**
        * generates an uid
        *
        * @returns {string} uid
        */
        uid() {
            return uuidV4();
        }
    }
}