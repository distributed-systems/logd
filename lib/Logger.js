!function() {
    'use strict';


    var   Class         = require('ee-class')
        , argv          = require('ee-argv')
        , Logger        = require('./Logger')
        , StackFrame    = require('./StackFrame')
        , EventEmitter  = require('ee-event-emitter')
        , logLevels     = require('./logLevels')
        , Message       = require('./Message');



    var classDefinition = {
        inherits: EventEmitter


        // collect caller info (file, line, method etc)
        // defaults to true, cann be disabled via the
        // «--no-callerinfo» cmd switch
        , _collectCallerInfo: true


        /**
         * set up the class
         */
        , init: function(options) {

            // store required values
            this.moduleName = options.moduleName;
            this.rootPath = options.rootPath;

            // custom stackframe class
            this.StackFrame = new StackFrame(this.moduleName, this.rootPath);

            // check if we should collect calelr info which is slow as fuck!
            if (argv.has('no-callerinfo')) this._collectCallerInfo = false;

            // replace
            if (this._collectCallerInfo) {
                // modify the global error object to get as 
                // fast as possible
                Error.prepareStackTrace = function(err, stack) {
                    return stack;
                };
            }
        }




        /**
         * execute a logging action
         *
         * @param <Array> log items
         * @param <>
         */
        , _log: function(level, callsiteInfo, data) {
            this.emit('message', new Message({
                  level         : level
                , callsiteInfo  : callsiteInfo
                , data          : data
            }));
        }





        /**
         * get the info about the calling line, it is slow:
         * it can be disabled using the «--no-callerinfo» 
         * cmd switch
         *
         * @param <Function> the method from where the 
         *                   callsite info should be returned
         *
         * @returns <String> the callsite info
         */
        , getCallSiteInfo: function(callSiteMethod) {
            var originalLimit = Error.stackTraceLimit;

            if (this._collectCallerInfo) {

                // limit the trace to the absolute neccessaary
                Error.stackTraceLimit = 1;

                // get the stack via an error
                var err = new Error();

                // get the correct frame
                Error.captureStackTrace(err, callSiteMethod);

                // set the original limit (its a global value)
                Error.stackTraceLimit = originalLimit;

                // return the formatted info
                return new this.StackFrame(err.stack[0]);
            }
            else return '[callerinfo disabled]';
        }
    };




    /*
     * apply log level methods to the classdefinition
     */
    Object.keys(logLevels.levels).forEach(function(levelName) {
        classDefinition[levelName] = function logLevelMethod() {
            var   callsiteInfo = this.getCallSiteInfo(logLevelMethod)
                , args = [];

            // copy args
            for (var i = 0, l = arguments.length; i < l; i++) args.push(arguments[i]);

            // log
            this._log(levelName, callsiteInfo, args);

            // daisy chaning
            return this;
        }
    });




    module.exports = new Class(classDefinition);
}();
