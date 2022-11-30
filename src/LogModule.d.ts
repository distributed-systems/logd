
export interface LogModule {
    constructor(): LogModule;
    log(...args: any[]): void;
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    notice(...args: any[]): void;
    wtf(...args: any[]): void;
    highlight(...args: any[]): void;
    success(...args: any[]): void;
}