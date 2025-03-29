import LogMessage from './LogMessage.js';
export default class LogdModule {
    logd;
    name;
    constructor(logd, name) {
        this.logd = logd;
        this.name = name;
    }
    log(...items) {
        this.logd.logMessage(new LogMessage(this.name, 'info', items));
    }
    debug(...items) {
        this.logd.logMessage(new LogMessage(this.name, 'debug', items));
    }
    notice(...items) {
        this.logd.logMessage(new LogMessage(this.name, 'notice', items));
    }
    info(...items) {
        this.logd.logMessage(new LogMessage(this.name, 'info', items));
    }
    warn(...items) {
        this.logd.logMessage(new LogMessage(this.name, 'warn', items));
    }
    error(...items) {
        this.logd.logMessage(new LogMessage(this.name, 'error', items));
    }
    fatal(...items) {
        this.logd.logMessage(new LogMessage(this.name, 'fatal', items));
    }
    wtf(...items) {
        this.logd.logMessage(new LogMessage(this.name, 'wtf', items));
    }
    success(...items) {
        this.logd.logMessage(new LogMessage(this.name, 'success', items));
    }
    highlight(...items) {
        this.logd.logMessage(new LogMessage(this.name, 'highlight', items));
    }
}
//# sourceMappingURL=LogdModule.js.map