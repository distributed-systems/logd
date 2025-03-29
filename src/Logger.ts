import LogMessage from './LogMessage.js';




export default class Logger {


    public log(message: LogMessage) : void {
        throw new Error('Method not implemented.');
    }


    // checks if logging is enabled
    public logsEnabled() : boolean {
        throw new Error('Method not implemented.');
    }

    public isLEveEnabled(level: string) : boolean {
        throw new Error('Method not implemented.');
    }


    public getEnabledLogLevel() : number {
        throw new Error('Method not implemented.');
    }
}