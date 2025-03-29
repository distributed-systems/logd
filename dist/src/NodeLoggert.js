import Logger from './Logger.js';
let ConsoleOuput;
if (typeof window === 'undefined') {
    ConsoleOuput = (await import('logd-console-output')).default;
}
export default class NodeLogger extends Logger {
    consoleOutput;
    queue = [];
    constructor() {
        super();
        if (!this.consoleOutput) {
            this.consoleOutput = new ConsoleOuput();
        }
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
        path = path.replace(projectroot + '/', '');
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