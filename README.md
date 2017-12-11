# logd

A powerful modular logging facility for node.js

Core features:

- Completely modular: log messages are packed into JSON objects and can be sent anywhere
- Routing: log messages with different levels can be sent to different targets
- Log source: log messages are tagged with the file and line where it was created
- Configurable output: the output of messages can be limited to certain levels
- Namespaces: all messages are part of user defined namespace which can be used for filtering



[![npm](https://img.shields.io/npm/dm/logd.svg?style=flat-square)](https://www.npmjs.com/package/logd)
[![Travis](https://img.shields.io/travis/eventEmitter/logd.svg?style=flat-square)](https://travis-ci.org/eventEmitter/logd)
[![node](https://img.shields.io/node/v/logd.svg?style=flat-square)](https://nodejs.org/)


## Using Logd

In the main file of your application or library, import the module, define a 
namespace and set a transport for the log output.

    import logd from 'logd';
    import ConsoleTransport from 'logd-console-transport';


    // if this isn't code loaded by another application
    // you should define a transport that is used for output
    logd.transport(new ConsoleTransport());


    // define the module we're logging from
    const log = logd.module('my-service');


    // start logging
    log.info('some information');


    // you may pass as many arguments as you like 
    // to the log methods
    log.error('something went wrong', err, {some: 'data'});


    // if you just want to output temporary logs to the console
    // that are not sent to any transport you may pass
    // directly data to the module by invoking it directly
    log(err, {an: 'object'}, 'direct to console logging ftw ;)');

