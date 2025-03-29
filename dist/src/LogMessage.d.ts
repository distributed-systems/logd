import { StackFrame } from 'error-stack-parser';
export type LogLevel = 'debug' | 'notice' | 'info' | 'warn' | 'error' | 'fatal' | 'wtf' | 'success' | 'highlight';
interface LogLevelConfiguration {
    level: LogLevel;
    value: number;
}
export default class LogMessage {
    private readonly logLevel;
    private readonly values;
    private readonly moduleName;
    private callsite;
    constructor(moduleName: string, logLevel: LogLevel, values: any[]);
    setCallsite(callsite: StackFrame): void;
    getCallsite(): StackFrame | undefined;
    hasCallsite(): boolean;
    getValues(): any[];
    getModuleName(): string;
    getLogLevel(): LogLevelConfiguration;
}
export {};
//# sourceMappingURL=LogMessage.d.ts.map