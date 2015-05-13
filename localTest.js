


    var   logd = require('./')
        , TestClass = require('ee-class');


    var log = require('ee-log');



    var myModule = logd.module('test');





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
