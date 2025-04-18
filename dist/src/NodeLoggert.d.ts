import Logger from './Logger.js';
import LogMessage from './LogMessage.js';
export default class NodeLogger extends Logger {
    private readonly consoleOutput;
    private readonly queue;
    private _logsEnabled;
    private _enabledLogLevel;
    constructor();
    logsEnabled(): boolean;
    getEnabledLogLevel(): number;
    log(message: LogMessage): void;
    private truncatePath;
    private dirname;
}
//# sourceMappingURL=NodeLoggert.d.ts.map