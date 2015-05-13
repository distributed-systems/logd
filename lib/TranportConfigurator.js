!function() {
    'use strict';


    var   Class         = require('ee-class')
        , log           = require('ee-log')
        , type          = require('ee-types')
        , EventEmitter  = require('ee-event-emitter')
        , logLevels     = require('./logLevels');


    /**
     * manages the ddifferent transports and routes log messages towards them
     */


    module.exports = new Class({
        inherits: EventEmitter

        // stub, will b e replaced
        , environments: []
        , selectedLevels: []

        // valid environments
        , validEnvironments: {
              dev: true
            , staging: true
            , testing: true
            , live: true
        }


        , init: function(transport) {

            // used for adding and removin routes
            this.transport = transport;
        }



        /**
         * define on which levels to log
         */
        , levels: function() {
            this.selectedLevels = [];

            for (var i = 0, l = arguments.length; i < l; i++) {
                if (type.array(arguments[i])) arguments[i].forEach(this._addLevel.bind(this)); 
                else this._addLevel(arguments[i]);
            }

            return this;
        }


        /**
         * all levels and greater
         */
        , andUp: function(to) {
            this.selectedLevels.forEach(function(level) {
                (to ? logLevels.between(level, to) : logLevels.gte(level)).forEach(this._registerLevel.bind(this));
            }.bind(this));

            return this;
        }


         /**
         * all levels inclkuding & between
         */
        , between: function(from, to) {
            logLevels.between(from, to).forEach(this._registerLevel.bind(this));

            return this;
        }


         /**
         * all levels and below
         */
        , andBelow: function(to) {
            this.selectedLevels.forEach(function(level) {
                (to ? logLevels.between(to, level) : logLevels.lte(level)).forEach(this._registerLevel.bind(this));
            }.bind(this));

            return this;
        }



        /**
         * add levels to the router and our storage
         */
        , _addLevel: function(level) {
            if (level === 'all') logLevels.all().forEach(this._addLevel.bind(this));
            else {
                if (!type.string(level)) throw new Error('The levels method only accepts strings, «'+type(level)+'» given!');
                this.selectedLevels.push(level);
                this._registerLevel(level);
            }
        }



        /**
         * register a level at the router
         */
        , _registerLevel: function(level) {
            this.environments.forEach(function(env) {
                this.emit('routeAdd', this.transport, env, level);
            }.bind(this));
        }



        /**
         * set the environments the following instructions are ment for
         */
        , env: function() {
            this.environments = [];

            for (var i = 0, l = arguments.length; i < l; i++) {
                if (type.array(arguments[i])) {
                    arguments[i].forEach(function(env) {
                        if (env === 'all') {
                            Object.keys(this.validEnvironments).forEach(function(localEnv) {
                                this.environments.push(localEnv);
                            }.bind(this));
                        }
                        else {
                            if (!this.validEnvironments[env]) throw new Error('The «'+env+'» environment is not valid, only '+Object.keys(this.validEnvironments).join(', ')+' are vali environments!');
                            this.environments.push(env);
                        }
                    }.bind(this)); 
                }
                else {
                     if (arguments[i] === 'all') {
                        Object.keys(this.validEnvironments).forEach(function(localEnv) {
                            this.environments.push(localEnv);
                        }.bind(this));
                    }
                    else {
                        if (!this.validEnvironments[arguments[i]]) throw new Error('The «'+arguments[i]+'» environment is not valid, only '+Object.keys(this.validEnvironments).join(', ')+' are vali environments!');
                        this.environments.push(arguments[i]);
                    }
                }
            }

            return this;
        }
    });
}();


    