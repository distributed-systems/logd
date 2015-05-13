!function() {
    'use strict';


    var   Class                 = require('ee-class')
        , log                   = require('ee-log')
        , envr                  = require('envr')
        , TranportConfigurator  = require('./TranportConfigurator')
        , logLevels             = require('./logLevels');


    /**
     * manages the ddifferent transports and routes log messages towards them
     */


    module.exports = new Class({

        init: function() {

            // transport storage
            this.transports = [];

            // expos the env
            this.env = envr.env;

            // routing table per environment
            this.routingTable = {
                  live: {}
                , staging: {}
                , testing: {}
                , dev:{}
            };


            // laod default rouiutng table
            this.defaultRoutes = this.routingTable[this.env];
        }



        /**
         * routes logs to the correct transports
         */
        , log: function(message) {
            if (this.defaultRoutes[message.level]) {
                this.defaultRoutes[message.level].forEach(function(transport) {
                    transport.log(message);
                }.bind(this));
            }
        }



        /**
         * calledd by the route configurators when adding new routes
         *
         * @param <Object> transport
         * @param <String> environment, one of dev, live, staging, testing
         * @param <String> loglevel live dev, warn ...
         */
        , addRoute: function(transport, environment, level) {
            if (!this.routingTable[environment][level]) this.routingTable[environment][level] = [];
            this.routingTable[environment][level].push(transport);
        }




        /**
         * calledd by the route configurators when removing new routes
         *
         * @param <Object> transport
         * @param <String> environment, one of dev, live, staging, testing
         * @param <String> loglevel live dev, warn ...
         */
        , routeRemove: function(transport, environment, level) {
            if (this.routingTable[environment][level]) {
                this.routingTable[environment][level].some(function(existingTransport, index) {
                    if (existingTransport === transport) {
                        this.routingTable[environment][level].splice(index, 1);
                        return true;
                    }
                }.bind(this));
            }
        }



        /**
         * add a trnaposrt, messages will eb 
         */
        , use: function(transport) {
            var configurator = new TranportConfigurator(transport);

            // accept routing instructions
            configurator.on('routeAdd', this.addRoute.bind(this));
            configurator.on('routeRemove', this.removeRoute.bind(this));

            // register locally
            this.transports.push(configurator);
            
            return configurator;
        }
    });
}();


    