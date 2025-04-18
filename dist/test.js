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
log.log(new Error('nope'), { a: 3, b: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });
try {
    function thrower() {
        throw new Error('test');
    }
    class a {
        a;
        constructor() {
            this.a = 1;
        }
        do() {
            this.a = 2;
            this.call();
        }
        call() {
            thrower();
        }
    }
    const b = new a();
    log.log(b);
    log.debug(a);
    b.do();
}
catch (e) {
    log.error(e);
}
//# sourceMappingURL=test.js.map