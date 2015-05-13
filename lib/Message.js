!function() {
    'use strict';


    var   Class  = require('ee-class')
        , log    = require('ee-log');




    module.exports = new Class({

        init: function(options) {
            this.data           = options.data;
            this.callsiteInfo   = options.callsiteInfo;
            this.level          = options.level;
        }
    });
}();


    