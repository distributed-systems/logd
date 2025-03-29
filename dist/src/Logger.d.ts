import LogMessage from './LogMessage.js';
export default class Logger {
    log(message: LogMessage): void;
    logsEnabled(): boolean;
    isLEveEnabled(level: string): boolean;
    getEnabledLogLevel(): number;
}
//# sourceMappingURL=Logger.d.ts.map