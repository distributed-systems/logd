'use strict';

const section = require('section-tests');
const Argv = require('./lib/Argv');
const TestTransport = require('./lib/TestTransport');
const assert = require('assert');
const globalLog = require('../');

const argv = new Argv();

            

section('Log Messages', (section) => {

    section.test('Text message', async() => {
        argv.add('--log-level=0+');
        argv.add('--log-module=a');

        // get a fresh log instance
        const log = globalLog.createInstance();

        // get a module
        const module = log.module('a');

        // get the test transport so that we can 
        // intercept messages
        const transport = new TestTransport();

        // register the transport
        log.transport(transport);

        // send the test payload
        module.info('some message');

        // get the message fron the test transport
        const message = await transport.getMessage();


        // validate
        assert(message, 'missing log message');
        assert.equal(message.type, 'message');
        assert.equal(message.level.name, 'info');
        assert.equal(message.data[0].type, 'data');
        assert.equal(message.data[0].data, 'some message');

        // clean up
        argv.clear();
    });



    section.test('Callsite', async() => {
        argv.add('--log-level=0+');
        argv.add('--log-module=a');

        // get a fresh log instance
        const log = globalLog.createInstance();

        // get a module
        const module = log.module('a');

        // get the test transport so that we can 
        // intercept messages
        const transport = new TestTransport();

        // register the transport
        log.transport(transport);

        // send the test payload
        module.info('some message');

        // get the message fron the test transport
        const message = await transport.getMessage();

//console.log(message);

        // validate
        assert(message, 'missing log message');
        assert.equal(message.callsite.type, 'Object');
        assert.equal(message.callsite.function, 'section.test');
        assert.equal(message.callsite.fileName, __filename);
        assert.equal(message.callsite.lineNumber, 70);

        // clean up
        argv.clear();
    });
});