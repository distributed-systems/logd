{
    'use strict';



    const assert    = require('assert');
    const Callsite  = require('./Callsite');
    const rootPath = require('app-root-path').toString();



    // the singleton nanalyzer
    // can eb used as singleton
    const callsite = new Callsite();






    module.exports = class ErrorMessage {



        constructor(err) {
            assert(err instanceof Error, 'expected an error object');

            this.type = 'error';
            this.name = err.name;
            this.message = err.message;

            const frames = callsite.getFromError(err);

            if (Array.isArray(frames)) {
                this.frames = frames.map(frame => callsite.convertStackFrame(frame)).map(frame => {
                    if (frame.fileName) frame.fileName = this.truncatePath(frame.fileName);
                    return frame;
                });
            } else {
                this.frames = frames;
            }
        }




        /**
        * truncate paths so that the part of the projects
        * directory is removed
        */
        truncatePath(path) {

            // remove the project root
            if (path.startsWith(rootPath)) path = path.substr(rootPath.length+1);
            else if (path.startsWith(`file://${rootPath}`)) path = path.substr(rootPath.length+1+7);

            // check for node modules, remove that
            const index = path.lastIndexOf('node_modules');
            if (index >= 0) path = 'nm:'+path.substr(index+'node_modules'.length);

            return path;
        }
    }
}