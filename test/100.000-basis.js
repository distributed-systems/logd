'use strict';

const section = require('section-tests');
const SpecReporter = section.SpecReporter;


// report to th console
section.use(new SpecReporter());



section('Import the class', (section) => {

    section.test('require the class', async() => {
        require('../');
    });
});