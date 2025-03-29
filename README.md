# logd

A powerful modular logging facility for node.js


[![npm](https://img.shields.io/npm/dm/logd.svg?style=flat-square)](https://www.npmjs.com/package/logd)

## Using Logd

In the main file of your application or library, import the module, define a 
namespace and set a transport for the log output.

    import logd from 'logd';

    // define the module we're logging from
    const log = logd.module('my-service');


    // start logging
    log.info('some information');


    // you may pass as many arguments as you like 
    // to the log methods
    log.error('something went wrong', err, {some: 'data'});


