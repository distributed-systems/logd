'use strict';

const section = require('section-tests');
const Argv = require('./lib/Argv');
const TestTransport = require('./lib/TestTransport');
const assert = require('assert');
const globalLog = require('../');

const argv = new Argv();

            

section('Debug logging', (section) => {

    section.test('a simple message', async() => {
        argv.add('--log-level=0+');
        argv.add('--log-module=a');

        // get a fresh log instance
        const log = globalLog.createInstance();

        // get a module
        const module = log.module('a');

        module('hi');

        // clean up
        argv.clear();
    });
});