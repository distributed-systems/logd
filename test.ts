import Logd from './src/Logd.js';


const logd = new Logd();

const log = logd.module('test');

log.log('Hello, world!');
log.debug('Hello, world!');
log.notice('Hello, world!');
log.info('Hello, world!');
log.warn('Hello, world!');
log.error('Hello, world!');
log.fatal('Hello, world!');
log.wtf('Hello, world!');
log.success('Hello, world!');
log.highlight('Hello, world!');
log.log(new Error('fuuuck'));