import { StackFrame } from 'error-stack-parser';
export type LogLevel = 'debug' | 'notice' | 'info' | 'warn' | 'error' | 'fatal' | 'wtf' | 'success' | 'highlight';
interface LogLevelConfiguration {
    level: LogLevel;
    value: number;
}
declare const levels: LogLevelConfiguration[];
export { levels };
export default class LogMessage {
    private readonly logLevel;
    private readonly values;
    private readonly moduleName;
    private callsite;
    constructor(moduleName: string, logLevel: LogLevel, values: any[]);
    hasErrorObject(): boolean;
    setCallsite(callsite: StackFrame): void;
    getCallsite(): StackFrame | undefined;
    hasCallsite(): boolean;
    getValues(): any[];
    getModuleName(): string;
    getLogLevel(): LogLevelConfiguration;
}
//# sourceMappingURL=LogMessage.d.ts.map