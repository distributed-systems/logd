


const logd = require('./');
const log = logd.module('x');


module.exports = {
    do() {
        log.info('aaaaaa', new Error('fail')).uid(log.uid());
        log.info(1).uid(log.uid());
        log.warn(true).uid(log.uid());
        log.error('fabian').uid(log.uid());
    }
}
