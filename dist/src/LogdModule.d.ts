import Logd from './Logd.js';
export default class LogdModule {
    private readonly logd;
    private readonly name;
    private readonly data;
    constructor(logd: Logd, name: string, data?: any);
    child(data: any): LogdModule;
    getData(): any;
    log(...items: any[]): void;
    trace(...items: any[]): void;
    debug(...items: any[]): void;
    notice(...items: any[]): void;
    info(...items: any[]): void;
    warn(...items: any[]): void;
    error(...items: any[]): void;
    fatal(...items: any[]): void;
    wtf(...items: any[]): void;
    success(...items: any[]): void;
    highlight(...items: any[]): void;
}
//# sourceMappingURL=LogdModule.d.ts.map