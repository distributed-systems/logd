import Logger from './Logger.js';
import { levels } from './LogMessage.js';
let ConsoleOuput;
if (typeof window === 'undefined') {
    ConsoleOuput = (await import('logd-console-output')).default;
}
export default class NodeLogger extends Logger {
    consoleOutput;
    queue = [];
    _logsEnabled;
    _enabledLogLevel;
    constructor() {
        super();
        if (!this.consoleOutput) {
            this.consoleOutput = new ConsoleOuput();
        }
    }
    // checks if logging is enabled
    logsEnabled() {
        if (this._logsEnabled !== undefined)
            return this._logsEnabled;
        this._logsEnabled = process.argv.includes('--log') || process.argv.includes('--l');
        return this._logsEnabled;
    }
    getEnabledLogLevel() {
        if (this._enabledLogLevel !== undefined) {
            return this._enabledLogLevel;
        }
        // process argv examples --level=debug 
        const level = process.argv.find(arg => arg.startsWith('--level='));
        if (level) {
            const levelName = level.replace('--level=', '');
            const levelConfig = levels.find(l => l.level === levelName);
            if (levelConfig) {
                this._enabledLogLevel = levelConfig.value;
                return levelConfig.value;
            }
        }
        // check for level like --warn
        for (const arg of process.argv) {
            if (arg.startsWith('--')) {
                const levelName = arg.replace('--', '');
                const levelConfig = levels.find(l => l.level === levelName);
                if (levelConfig) {
                    this._enabledLogLevel = levelConfig.value;
                    return levelConfig.value;
                }
            }
        }
        this._enabledLogLevel = 0;
        return 0;
    }
    log(message) {
        if (!this.consoleOutput) {
            throw new Error('ConsoleOutput not initialized');
        }
        else {
            if (message.hasCallsite()) {
                const callsite = message.getCallsite();
                callsite?.setFileName(this.truncatePath(callsite?.fileName ?? ''));
            }
            this.consoleOutput.log({ message });
        }
    }
    truncatePath(path) {
        const projectroot = this.dirname(process.argv.length > 1 ? process.argv[1] : process.cwd());
        path = path.replace('file://', '').replace(projectroot + '/', '');
        let index = path.indexOf('node_modules');
        if (index > -1) {
            path = path.substring(index);
        }
        return path;
    }
    dirname(path) {
        if (!path)
            return '.';
        const parts = path.replace(/\\/g, '/').split('/');
        parts.pop();
        return parts.length ? parts.join('/') || '/' : '.';
    }
}
//# sourceMappingURL=NodeLoggert.js.map