{
    'use strict';


    const log               = require('ee-log');
    const assert            = require('assert');

    const Callsite          = require('./Callsite');
    const TransportManager  = require('./TransportManager');
    const ErrorMessage      = require('./ErrorMessage');
    const Message           = require('./Message');



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
    }];








    module.exports = class Logger {


        constructor({moduleName = '__root__', parent = null, parentFiles = [], logLevels = defaultLevels} = {}) {

            // store the module information
            this.moduleName     = moduleName;
            this.parent         = parent;
            this.parentFiles    = parentFiles;


            // the avilabel log levels on this module
            this.logLevels = logLevels;


            // defaults
            this.argvEnabled = null;


            // map for storing the status of child modules
            this.enabledChildren = new Map();


            // determine if thsi module is enabled
            // via rgv, or parent
            this.moduleIsEnabled = null;




            // store modules only on the root
            if (this.isRootModule()) {
                this.pathMap = new Map();
                this.tranports = new TransportManager(this);
            }


            // add log functions
            for (const level of this.logLevels) {
                this.addLoglevelHandler(level);
            }
        }








        /**
        * resolve a tring level to a numebr level
        *
        * @param {string} level the log level
        *
        * @returns {number} level
        */
        resolveLogLevel(level) {
            if (this.logLevelRegistry.has(level)) return Array.from(this.logLevelRegistry.get(level));
            else return [];
        }









        /**
        * handles log messages that were emittedd
        *
        * @param {object} message the messagfe to transmit
        */ 
        sendLogMessage(message) {
            log(message);
        }









        /**
        * creates a log message that can be sent
        * to the transports
        *
        * @param {object} options
        *
        * @returns {object} message
        */
        createMessage({type, level, args, callSite}) {
            const message = new Message(type);



            // set level information
            message.setLevel(level);

            // set callsite
            message.setCallSite(callSite);




            // add optional parameters to the message
            if (args) {
                assert(Array.isArray(args), 'args have to eb an array!');

                for (const arg of args) {

                    // get call site information for errors
                    if (typeof arg === 'object' && arg instanceof Error) message.addData(new ErrorMessage(arg));
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
        addLoglevelHandler(level) {
            assert(typeof level === 'object', 'level must be an object');
            assert(typeof level.name === 'string', 'level.name must be a string');
            assert(/^[a-z][a-zA-Z0-9]*$/g.test(level.name), 'level.name must only contain a-z and 0-9. 0-9 is not allowed as first charachter')
            assert(typeof this[level.name] === 'undefined' || this.logLevels.some(l => l.name === level.name), `level.name msut not be ${level.name}. The name is in use already!`)
            assert(typeof level.level === 'number' && Number.isInteger(level.level), 'level.level must be an integer');
            assert(level.level >=0 && level.level <= 100,'level.level must be between 0 and 100!');



            // register level on the transpot manager
            this.getRootModule().transports.addLogLevelDescriptor(level);



            this[level.name] = (...args) => {

                // make sure not to user resources when
                // we're not enabled
                if (this.isEnabled()) {
                    const type      = 'message';
                    const callSite  = callsite.getCaller(1);
                    const message   = this.createMessage({callSite, type, level, args});


                    // transmit
                    this.sendLogMessage(message);
                }


                return this;
            }
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



            // distribute to all children too
            if (this.isRootModule()) {
                for (module of this.pathMap.values()) {
                    module.addLoglevelHandler(levelDefinition);
                    module.logLevels.push(levelDefinition);
                }
            }


            // publsih on the local module
            this.addLoglevelHandler(levelDefinition);
            this.logLevels.push(levelDefinition);


            return this;
        }








        /**
        * determined if this module is currently active
        * and if the logs should be sent to the transports
        *
        * checks also if any of the parrents ie enabled, or disabled
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
            const parent = this;
            const logLevels = this.logLevels.slice(0);


            // bust the require cache
            // creepy, nbut it's a workaroudn for now
            if (!dontBustCache) delete require.cache[modulePath];


            // return a new logger instance
            const instance = new Logger({moduleName, parent, parentFiles, logLevels});



            // add to map so it can be discovered later
            this.getModulePathMap().set(modulePath, instance);


            return instance;
        }








        /**
        * returns the root logger
        *
        * @returns {object} logger
        */
        getRootModule() {
            if (this.hasParent()) return this.getParent().getRootModule();
            else return this;
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
        * returns the parent of this module
        *
        * @returns {object} parent
        */
        getParent() {
            return this.parent;
        }






        /**
        * lets you check if there is a parent
        *
        * @returns {boolean} true if there is a parent
        */
        hasParent() {
            return !!this.parent;
        }







        /**
        * returns the modules map
        * 
        * @returns {map} modules
        */
        getModulesMap() {
            return this.getRootModule().modules;
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
            return this.hasParent() ? this.getRootModule().getLogLevels() : this.logLevels;
        }









        /**
        * determines if this is the root module
        *
        * @returns {boolean} true if is root
        */
        isRootModule() {
            return !this.hasParent();
        }









        /**
        * checks if this module is enabled somehow via 
        * process parameters
        *
        * @returns {boolean} true if enabled
        */
        isArgvEnabled() {
            if (this.argvEnabled === null) {
                if (process.argv.includes('--l')) return true;
                else if (process.argv.includes(`--l:${this.moduleName}`)) this.argvEnabled = true;
                else {

                    // check if i'm enabled via the argv 
                    // object, also if it has additional 
                    // parameter added to it
                    this.argvEnabled = process.argv.some(arg => new RegExp(`--l:${this.moduleName}`, 'gi').test(arg));
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
                this.enabledChildren.set(childName, process.argv.some(arg => new RegExp(`--l:${this.moduleName}.*(?:\\+children|\\+${childName}).*`, 'gi').test(arg) && !new RegExp(`--l:${this.moduleName}.*-${childName}.*`, 'gi').test(arg))); 
            }

            return this.enabledChildren.get(childName);
        }
    }
}
