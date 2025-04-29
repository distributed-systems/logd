import Logger from './Logger.js';
import LogMessage, { levels } from './LogMessage.js';

let ConsoleOuput: typeof import('logd-console-output').default | undefined;

// Only attempt to import in Node.js environment
if (typeof window === 'undefined' && typeof process !== 'undefined') {
    import('logd-console-output').then(module => {
        ConsoleOuput = module.default;
    }).catch(err => {
        console.error('Failed to load logd-console-output:', err);
    });
}

export default class NodeLogger extends Logger {

    private readonly consoleOutput: InstanceType<typeof import('logd-console-output').default> | undefined;
    private readonly queue: LogMessage[] = [];
    private _logsEnabled: boolean | undefined;
    private _enabledLogLevel: number | undefined;

    constructor() {
        super();
        if (typeof window === 'undefined' && typeof process !== 'undefined' && ConsoleOuput) {
            this.consoleOutput = new ConsoleOuput();
        }
    }

    // checks if logging is enabled
    public logsEnabled() : boolean {
        if (this._logsEnabled !== undefined) return this._logsEnabled;
        
        this._logsEnabled = process.argv.includes('--log') || process.argv.includes('--l');

        return this._logsEnabled;
    }


    public getEnabledLogLevel() : number {
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


    public log(message: LogMessage) : void {
        if (!this.consoleOutput) {
            throw new Error('ConsoleOutput not initialized');
        } else {
            if (message.hasCallsite()) {
                const callsite = message.getCallsite();
                callsite?.setFileName(this.truncatePath(callsite?.fileName ?? ''));
            }

            this.consoleOutput.log({message});
        }
    }


    private truncatePath(path: string) {
        const projectroot = this.dirname(process.argv.length > 1 ? process.argv[1] : process.cwd());
        path = path.replace('file://', '').replace(projectroot + '/', '');

        let index = path.indexOf('node_modules');
        if (index > -1) {
            path = path.substring(index);
        }

        return path;
    }

    private dirname(path: string) {
        if (!path) return '.';
        const parts = path.replace(/\\/g, '/').split('/');
        parts.pop(); 
        return parts.length ? parts.join('/') || '/' : '.';
    }
}