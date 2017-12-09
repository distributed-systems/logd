'use strict';

const section = require('section-tests');
const Argv = require('./lib/Argv');
const assert = require('assert');
const globalLog = require('../');

const argv = new Argv();
            



section('Command line arguments', (section) => {
    section('Log Level', (section) => {
        section.test('set the log level using syntax a', async() => {
            argv.add('--l-level:20');
            const log = globalLog.createInstance();
            assert.equal(log.levelFrom, 20);
            argv.clear();
        });


        section.test('set the log level using syntax b', async() => {
            argv.add('--log-level=20');
            const log = globalLog.createInstance();
            assert.equal(log.levelFrom, 20);
            argv.clear();
        });


        section.test('set the log level exact offset using a number', async() => {
            argv.add('--log-level=20');
            const log = globalLog.createInstance();
            assert.equal(log.levelFrom, 20);
            assert.equal(log.levelTo, 20);
            argv.clear();
        });


        section.test('set the log level lower bound using a number', async() => {
            argv.add('--log-level=20+');
            const log = globalLog.createInstance();
            assert.equal(log.levelFrom, 20);
            assert.equal(log.levelTo, 100);
            argv.clear();
        });


        section.test('set the log level exact offset using a level', async() => {
            argv.add('--log-level=info');
            const log = globalLog.createInstance();
            assert.equal(log.levelFrom, 50);
            assert.equal(log.levelTo, 50);
            argv.clear();
        });


        section.test('set the log level lower bound using a level', async() => {
            argv.add('--log-level=info+');
            const log = globalLog.createInstance();
            assert.equal(log.levelFrom, 50);
            assert.equal(log.levelTo, 100);
            argv.clear();
        });
    });






    section('Log Module', (section) => {
        section.test('set the log module using syntax a', async() => {
            argv.add('--l:a');
            const log = globalLog.createInstance();
            const module = log.module('a');
            assert.equal(module.isEnabled(), true);
            argv.clear();
        });


        section.test('set the log module using syntax b', async() => {
            argv.add('--log-module=a');
            const log = globalLog.createInstance();
            const module = log.module('a');
            assert.equal(module.isEnabled(), true);
            argv.clear();
        });


        section.test('all modules disabled', async() => {
            const log = globalLog.createInstance();
            const module = log.module('a');
            assert.equal(module.isEnabled(), false);
        });


        section.test('all modules enabled', async() => {
            argv.add('--log');
            const log = globalLog.createInstance(); 
            const module = log.module('a');
            assert.equal(module.isEnabled(), true);
            argv.clear();
        });
    });
});