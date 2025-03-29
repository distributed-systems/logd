import Logger from './Logger.js';
import LogMessage from './LogMessage.js';
export default class BrowserLogger extends Logger {
    private readonly colors;
    private _logsEnabled;
    private _enabledLogLevel;
    constructor();
    getEnabledLogLevel(): number;
    logsEnabled(): boolean;
    log(message: LogMessage): void;
    /**
     * Converts our chalk-style color string (e.g. "yellow.bold" or "magenta.bold.bgWhite")
     * to a CSS style string for console styling.
     */
    private getStyleForLevel;
}
//# sourceMappingURL=BrowserLogger.d.ts.map