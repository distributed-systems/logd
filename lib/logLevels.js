!function() {
    'use strict';


    var   Class  = require('ee-class')
        , log    = require('ee-log');



    module.exports = new (new Class({

      
        levels: {
              emergency: 1000
            , alert: 900
            , critical: 800
            , error: 700
            , warn: 600
            , notice: 500
            , info: 400
            , debug: 300
        }


        , levelArray: []




        , init: function() {
            Object.keys(this.levels).forEach(function(levelName) {
                this[levelName] = this.levels[levelName];

                this.levelArray.push(levelName);
            }.bind(this));
        }


        , all: function() {
            return this.levelArray;
        }


        , add: function(level, value) {
            this[level] = value;
            this.levels[level] = value;
                
            this.levelArray.push(levelName);
        }


        , gte: function(value) {
            return this.levelArray.filter(function(level) {
                return level.value >= value;
            });
        }



        , lte: function(value) {
            return this.levelArray.filter(function(level) {
                return level.value <= value;
            });
        }



        , between: function(lower, upper) {
            var tempLower;

            if (lower > upper) {
                tempLower = lower;
                lower = upper;
                upper = tempLower;
            }

            return this.levelArray.filter(function(level) {
                return level.value >= lower && level.value <= upper;
            });
        }
    }));
}();
