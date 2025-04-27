import Logd from './Logd.js';
import LogMessage from './LogMessage.js';





export default class LogdModule {

    private readonly logd: Logd;
    private readonly name: string;
    private readonly data: any;
    constructor(logd: Logd, name: string, data?: any) {
        this.logd = logd;
        this.name = name;
        this.data = data;
    }

    public child(data: any) {
        return new LogdModule(this.logd, this.name, { ...this.data, ...data });
    }



    public log(...items: any[]) {
        this.logd.logMessage(new LogMessage(this.name, 'info', items));
    }

    public trace(...items: any[]) {
        this.logd.logMessage(new LogMessage(this.name, 'debug', items));
    }

    public debug(...items: any[]) {
        this.logd.logMessage(new LogMessage(this.name, 'debug', items));
    }

    public notice(...items: any[]) {
        this.logd.logMessage(new LogMessage(this.name, 'notice', items));
    }

    public info(...items: any[]) {
        this.logd.logMessage(new LogMessage(this.name, 'info', items));
    }

    public warn(...items: any[]) {
        this.logd.logMessage(new LogMessage(this.name, 'warn', items));
    }

    public error(...items: any[]) {
        this.logd.logMessage(new LogMessage(this.name, 'error', items));
    }

    public fatal(...items: any[]) {
        this.logd.logMessage(new LogMessage(this.name, 'fatal', items));
    }

    public wtf(...items: any[]) {
        this.logd.logMessage(new LogMessage(this.name, 'wtf', items));
    }

    public success(...items: any[]) {
        this.logd.logMessage(new LogMessage(this.name, 'success', items));
    }

    public highlight(...items: any[]) {
        this.logd.logMessage(new LogMessage(this.name, 'highlight', items));
    }
}