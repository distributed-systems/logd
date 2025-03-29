import BrowserLogger from './BrowserLogger.js';
import LogdModule from './LogdModule.js';
import Logger from './Logger.js';
import LogMessage from './LogMessage.js';
import NodeLogger from './NodeLoggert.js';
import ErrorStackParser from 'error-stack-parser';


type Env = 'node' | 'browser';

export default class Logd {

    private readonly env : Env = typeof process !== 'undefined' ? 'node' : 'browser';
    private readonly logger: Logger;

    constructor() {
        if (this.env === 'node') {
            this.logger = new NodeLogger();
        } else {
            this.logger = new BrowserLogger();
        }
    }


    public module(name: string) {
        return new LogdModule(this, name);
    }


    public logMessage(message: LogMessage) {
        const logsEnabled = this.logger.logsEnabled();
        if (!logsEnabled) return;

        const enabledLogLevel = this.logger.getEnabledLogLevel();
        const messageLogLevel = message.getLogLevel().value;
        if (messageLogLevel < enabledLogLevel) return

        const frames = ErrorStackParser.parse(new Error('reference'));
        if (frames.length > 2) message.setCallsite(frames[2]);
        this.logger.log(message);
    }
}