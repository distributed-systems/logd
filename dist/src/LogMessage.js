const levels = [
    { level: 'debug', value: 10 },
    { level: 'notice', value: 20 },
    { level: 'info', value: 30 },
    { level: 'warn', value: 40 },
    { level: 'error', value: 50 },
    { level: 'fatal', value: 60 },
    { level: 'wtf', value: 70 },
    { level: 'success', value: 80 },
    { level: 'highlight', value: 90 }
];
export default class LogMessage {
    logLevel;
    values;
    moduleName;
    callsite;
    constructor(moduleName, logLevel, values) {
        this.moduleName = moduleName;
        this.logLevel = logLevel;
        this.values = values;
    }
    setCallsite(callsite) {
        this.callsite = callsite;
    }
    getCallsite() {
        return this.callsite;
    }
    hasCallsite() {
        return this.callsite !== undefined;
    }
    getValues() {
        return this.values;
    }
    getModuleName() {
        return this.moduleName;
    }
    getLogLevel() {
        return levels.find(level => level.level === this.logLevel);
    }
}
//# sourceMappingURL=LogMessage.js.map