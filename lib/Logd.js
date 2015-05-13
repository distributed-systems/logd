!function() {
    'use strict';


    var   Class             = require('ee-class')
        , log               = require('ee-log')
        , envr              = require('envr')
        , fs                = require('fs')
        , Logger            = require('./Logger')
        , TransportManager  = require('./TransportManager');



    module.exports = new Class({

        init: function(options) {

            // get the env we're running in
            this.env = envr.env;

            // the logger needs the project root
            Class.define(this, '_rootPath', Class(this._getProjectRootPath()));

            // need a default logger for getting callsite info
            Class.define(this, '_defaultLogger', Class(new Logger({
                  moduleName : 'logd'
                , rootPath   : this._rootPath
            })));


            // set up the transportmanager
            this.transport = new TransportManager(this.logLevels);


            // storage for modules (not enumerable)
            Class.define(this, 'modules', Class({}));
            Class.define(this, 'pathMap', Class({}));
        }



        /**
         * create or return a logger instance
         */
        , module: function loadModule(moduleName) {
            var logger, callSite, callSiteFile, index, moduleBasPath;

            // get the root module folder
            callSite = this._defaultLogger.getCallSiteInfo(loadModule);
            callSiteFile = callSite.file;
            index = callSiteFile.lastIndexOf(':nm');

            //
            if (index === -1) moduleBasPath = this._rootPath;
            else moduleBasPath = this._rootPath+callSiteFile.slice(0, callSiteFile.indexOf('/', index+2));


            if (moduleName) {
                if (!this.modules[moduleName]) {

                    // logger instance
                    this.pathMap[moduleBasPath] = this.modules[moduleName] = new Logger({
                          moduleName: moduleName
                        , rootPath  : this._rootPath
                    });
                }

                return this.modules[moduleName];
            }
            else if (this.pathMap[moduleBasPath]) {
                // check for an exiting module
                return this.pathMap[moduleBasPath];
            }
            else throw new Error('Cannot laod logd module for ccallsite: '+JSON.stringify(callSite));
        }





        /**
         * returns the projects root path
         */
        , _getProjectRootPath: function() {
            var   file = process.argv[1]
                , stats;

            if (file && file.indexOf('node_modules') >= 0) file = file.substr(0, file.indexOf('node_modules'));

            stats = fs.statSync(file);

            if (stats) {
                if (stats.isDirectory()) return file+'/';
                else return file.substr(0, file.lastIndexOf('/')+1);
            }
        }
    });
}();
