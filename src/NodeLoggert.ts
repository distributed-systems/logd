import Logger from './Logger.js';
import LogMessage from './LogMessage.js';

let ConsoleOuput: typeof import('logd-console-output').default;
if (typeof window === 'undefined') {
    ConsoleOuput = (await import('logd-console-output')).default;
}



export default class NodeLogger extends Logger {

    private readonly consoleOutput: InstanceType<typeof import('logd-console-output').default>;
    private readonly queue: LogMessage[] = [];

    constructor() {
        super();
        if (!this.consoleOutput) {
            this.consoleOutput = new ConsoleOuput();
        }
    }



    public log(message: LogMessage) : void {
        if (!this.consoleOutput) {
            throw new Error('ConsoleOutput not initialized');
        } else {
            if (message.hasCallsite()) {
                const callsite = message.getCallsite();
                callsite?.setFileName(this.truncatePath(callsite?.fileName ?? ''));
            }

            // @ts-ignore
            this.consoleOutput.log({message});
        }
    }


    private truncatePath(path: string) {
        const projectroot = this.dirname(process.argv.length > 1 ? process.argv[1] : process.cwd());
        path = path.replace(projectroot + '/', '');

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