!function() {
    'use strict';


    var   Class  = require('ee-class')
        , log    = require('ee-log');




    module.exports = new Class({

        init: function(moduleName, rootPath) {

            // custom classes
            return new Class({

                  line      : Class(0).Writable().Enumerable()
                , column    : Class(0).Writable().Enumerable()
                , method    : Class('').Writable().Enumerable()
                , className : Class('').Writable().Enumerable()
                , path      : Class(rootPath).Writable().Enumerable()
                , file      : Class('').Writable().Enumerable()
                , module    : moduleName



                , init: function(stackFrame) {
                    var   callsiteInfo = {}
                        , methodName = stackFrame.getFunctionName();

                    // make visible, what a dirty hack :(
                    this.path = this.path;

                    this.file = stackFrame.getFileName() ? (stackFrame.getFileName().slice(this.path.length).replace(/node_modules/gi, ':nm')) : '<unknown>'
                    
                    this.module = this.module;
                    if (methodName && methodName.indexOf('.') >= 0) this.className = methodName.slice(0, (methodName.indexOf('.') || 0)); 
                    this.method = stackFrame.getMethodName() || '<Anonymous>'
                    this.line = stackFrame.getLineNumber();
                    this.column = stackFrame.getColumnNumber();

                }




                , toString: function() {
                    return '('+this.file+ ' '+this.line+':'+this.column + ') ' +
                        this.module + ' > ' +
                        (this.className ? this.className + '.' : '') + 
                        this.method ;
                }
            });
        }
    });
}();


    