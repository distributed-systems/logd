import Logd from './Logd.js';
export default class LogdModule {
    private readonly logd;
    private readonly name;
    constructor(logd: Logd, name: string);
    log(...items: any[]): void;
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