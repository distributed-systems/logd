


    var   logd = require('./')
        , log  = require('ee-log')
        , TestClass = require('ee-class')
        , Transport = require('logd-transport');


    var log = require('ee-log');



    var myModule = logd.module('test');


    logd.transport.use(new Transport()).env('all').levels('all');


    var X = new TestClass({

        init: function() {
            myModule.warn(1,2,3)
        }


        , say: function() {
            myModule.error(1,2,3)
        }
    });



    new X().say();



    (function a() {
        myModule.debug(1,2,3)
    })();
