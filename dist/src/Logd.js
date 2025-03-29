import BrowserLogger from './BrowserLogger.js';
import LogdModule from './LogdModule.js';
import NodeLogger from './NodeLoggert.js';
import ErrorStackParser from 'error-stack-parser';
export default class Logd {
    env = typeof process !== 'undefined' ? 'node' : 'browser';
    logger;
    constructor() {
        if (this.env === 'node') {
            this.logger = new NodeLogger();
        }
        else {
            this.logger = new BrowserLogger();
        }
    }
    module(name) {
        return new LogdModule(this, name);
    }
    logMessage(message) {
        const logsEnabled = this.logger.logsEnabled();
        if (!logsEnabled)
            return;
        const enabledLogLevel = this.logger.getEnabledLogLevel();
        const messageLogLevel = message.getLogLevel().value;
        if (messageLogLevel < enabledLogLevel)
            return;
        const frames = ErrorStackParser.parse(new Error('reference'));
        if (frames.length > 2)
            message.setCallsite(frames[2]);
        this.logger.log(message);
    }
}
//# sourceMappingURL=Logd.js.map