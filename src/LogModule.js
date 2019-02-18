{
    'use strict';


    const assert            = require('assert');
    const uuidV4            = require('uuid/v4');
    const log               = require('ee-log');


    const Callsite          = require('./Callsite');
    const ErrorMessage      = require('./ErrorMessage');
    const Message           = require('./Message');
    const MessageWrapper    = require('./MessageWrapper');



    // the singleton nanalyzer
    // can be used as singleton
    const callsite = new Callsite();






    module.exports = class LogModule {


        constructor({moduleName = '__root__', rootModule = null, parentFiles = [], logLevels = []} = {}) {

            // store the module information
            this.moduleName     = moduleName;
            this.rootModule     = rootModule;
            this.parentFiles    = parentFiles;


            // the avilabel log levels on this module
            this.logLevels = logLevels;


            // defaults
            this.argvEnabled = null;


            // map for storing the status of child modules
            this.enabledChildren = new Map();


            // determine if thsi module is enabled
            // via asrgv, or rootModule
            this.moduleIsEnabled = null;

            // create a function that can used to log directly to the terminal
            // it should only be used for debugging purposes!
            const instance = (...args) => {
                log.info(...args);
            }

            // publish also public methods on that function
            instance.isEnabled = this.isEnabled.bind(this);
            instance.getName = this.getName.bind(this);
            instance.hasEnabledChild = this.hasEnabledChild.bind(this);

            
            // add log functions
            for (const level of this.logLevels) {
                this.addLoglevelHandler(level, instance);
            }


            return instance;
        }











        /**
        * handles log messages that were emittedd
        *
        * @param {object} message the messagfe to transmit
        */ 
        sendLogMessage(message) {
            this.getTransport().sendMessage(message);
        }









        /**
        * creates a log message that can be sent
        * to the transports
        *
        * @param {object} options
        *
        * @returns {object} message
        */
        createMessage({type, level, args, callSite, moduleName}) {
            const message = new Message(type, moduleName);



            // set level information
            message.setLevel(level);

            // set callsite
            message.setCallSite(callSite);




            // add optional parameters to the message
            if (args) {
                assert(Array.isArray(args), 'args have to be an array!');

                for (const arg of args) {

                    // get call site information for errors
                    if (typeof arg === 'object' && arg instanceof Error) message.addDataObject(new ErrorMessage(arg));
                    else message.addData(arg);
                }
            }


            return message;
        }









        /**
        * create a function for accesing a specific log 
        * level handler function on the logging module
        *
        * @param {object} loglevel
        *
        * @returns {object} this
        */
        addLoglevelHandler(level, instance) {
            assert(typeof level === 'object', 'level must be an object');
            assert(typeof level.name === 'string', 'level.name must be a string');
            assert(/^[a-z][a-zA-Z0-9]*$/g.test(level.name), 'level.name must only contain a-z and 0-9. 0-9 is not allowed as first charachter')
            assert(typeof this[level.name] === 'undefined' || this.logLevels.some(l => l.name === level.name), `level.name msut not be ${level.name}. The name is in use already!`)
            assert(typeof level.level === 'number' && Number.isInteger(level.level), 'level.level must be an integer');
            assert(level.level >=0 && level.level <= 100,'level.level must be between 0 and 100!');


            // cache.. for speed
            const levelFrom = this.getRootModule().levelFrom;
            const levelTo = this.getRootModule().levelTo;



            // register level on the transpot manager
            this.getTransport().addLogLevelDescriptor(level);



            instance[level.name] = this[level.name] = (...args) => {

                // make sure not to user resources when
                // we're not enabled
                if (this.isEnabled() && level.level >= levelFrom && level.level <= levelTo) {
                    const type = 'message';
                    const callSite = callsite.getCaller(1);
                    const moduleName = this.moduleName; 
                    const message = this.createMessage({callSite, type, level, args, moduleName});


                    // transmit in next cycle, this leaves the user a chance
                    // to set an id afterwards
                    process.nextTick(() => {
                        this.sendLogMessage(message);
                    });
                    

                    // return the message to the user so that
                    return new MessageWrapper(message);
                }

                // let the user manipulate non messages as well
                // since the level or the module could be disbaled
                return new MessageWrapper();
            }
        }












        /**
        * determined if this module is currently active
        * and if the logs should be sent to the transports
        *
        * checks also if any of the parents is enabled, or disabled
        * depending if this module was explicitly activated or implicitly.
        * if a parent is enabled, and the the --children flags was
        * passed this module shall be enabled, if this module was explicitly
        * enabled and a parent was not enabled, this module should 
        * also not be enabled except if the --children flag was enabled 
        */
        getEnabledStatus() {
            if (this.isArgvEnabled()) return true;
            else {
                const map = this.getModulePathMap();

                for (const file of this.parentFiles) {
                    if (map.has(file) && 
                        map.get(file).getName() !== this.name &&
                        map.get(file).hasEnabledChild(this.getName())) {
                        return true;
                    }
                }

                return false;
            }
        }









        /**
        * returne the status of the module
        *
        * @returns {boolean} status
        */
        isEnabled() {
            if (this.moduleIsEnabled === null) this.moduleIsEnabled = this.getEnabledStatus();
            return this.moduleIsEnabled;
        }








        /**
        * returns the root logger
        *
        * @returns {object} logger
        */
        getRootModule() {
            return this.rootModule;
        }






        /**
        * returns the name of this module
        *
        * @returns {string} moduleName
        */
        getName() {
            return this.moduleName;
        }







        /**
        * returns the transports manager
        * 
        * @returns {object} transports
        */
        getTransport() {
            return this.getRootModule().getTransportManager();
        }







        /**
        * returns the modules path map
        * 
        * @returns {map} modules
        */
        getModulePathMap() {
            return this.getRootModule().pathMap;
        }







        /**
        * returns the availbale log levels
        * 
        * @returns {map} logLevels
        */
        getLogLevels() {
            return this.getRootModule().getLogLevels();
        }









        /**
        * checks if this module is enabled somehow via 
        * process parameters
        *
        * @returns {boolean} true if enabled
        */
        isArgvEnabled() {
            if (this.argvEnabled === null) {
                if (process.argv.includes('--l') || process.argv.includes('--log')) return true;
                else {

                    // check if i'm enabled via the argv 
                    // object, also if it has additional 
                    // parameter added to it
                    this.argvEnabled = process.argv.some(arg => new RegExp(`--l(?:og-module)?(?::|=)(?:${this.moduleName}|\\*)`, 'gi').test(arg));
                }
            }
            
            return this.argvEnabled;
        }









        /**
        * checks if this module has an enabled child
        * 
        * @param {sttring} childName the name of the child to check for
        *
        * @returns {boolean}
        */
        hasEnabledChild(childName) {
            if (!this.enabledChildren.has(childName)) {
                this.enabledChildren.set(childName, process.argv.some(arg => new RegExp(`--l(?:og-module)?(?::|=)${this.moduleName}.*(?:\\+children|\\+${childName}).*`, 'gi').test(arg) && !new RegExp(`--l(?:og-module)?(?::|=)${this.moduleName}.*-${childName}.*`, 'gi').test(arg))); 
            }

            return this.enabledChildren.get(childName);
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
