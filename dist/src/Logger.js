export default class Logger {
    loaded = false;
    async load() {
        this.setLoaded();
    }
    setLoaded() {
        this.loaded = true;
    }
    isLoaded() {
        return this.loaded;
    }
    log(message) {
        throw new Error('Method not implemented.');
    }
    // checks if logging is enabled
    logsEnabled() {
        throw new Error('Method not implemented.');
    }
    isLEveEnabled(level) {
        throw new Error('Method not implemented.');
    }
    getEnabledLogLevel() {
        throw new Error('Method not implemented.');
    }
}
//# sourceMappingURL=Logger.js.map