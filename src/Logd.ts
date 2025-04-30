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
    private readonly messageQueue: LogMessage[] = [];

    constructor() {
        if (this.env === 'node') {
            this.logger = new NodeLogger();
        } else {
            this.logger = new BrowserLogger();
        }

        this.logger.load().then(() => {
            this.processQueue();
        });
    }


    public module(name: string) {
        return new LogdModule(this, name);
    }


    public logMessage(message: LogMessage) {
        const hasErrorObject = message.hasErrorObject();
        const logsEnabled = this.logger.logsEnabled();
        if (!logsEnabled && !hasErrorObject) return;

        const enabledLogLevel = this.logger.getEnabledLogLevel();
        const messageLogLevel = message.getLogLevel().value;
        if (messageLogLevel < enabledLogLevel && !hasErrorObject) return;

        // no callsite in the browser required
        if (this.env === 'node') {
            const frames = ErrorStackParser.parse(new Error('reference'));
            if (frames.length > 2) message.setCallsite(frames[2]);
        }

        if (this.logger.isLoaded()) {
            this.logger.log(message);
        } else {
            this.messageQueue.push(message);
        }
    }



    private processQueue() {
        if (this.messageQueue.length > 0) {
            for (const msg of this.messageQueue) {
                this.logger.log(msg);
            }
            this.messageQueue.length = 0;
        }
    }
}