import { StackFrame } from 'error-stack-parser';

export type LogLevel = 'debug' | 'notice' | 'info' | 'warn' | 'error' | 'fatal' | 'wtf' | 'success' | 'highlight';

interface LogLevelConfiguration {
    level: LogLevel;
    value: number;
}

const levels : LogLevelConfiguration[] = [
    { level: 'debug', value: 10 },
    { level: 'notice', value: 20 },
    { level: 'info', value: 30 },
    { level: 'warn', value: 40 },
    { level: 'error', value: 50 },
    { level: 'fatal', value: 60 },
    { level: 'wtf', value: 70 },
    { level: 'success', value: 80 },
    { level: 'highlight', value: 90 }
];

export default class LogMessage {

    private readonly logLevel: LogLevel;
    private readonly values: any[];
    private readonly moduleName: string;
    private callsite: StackFrame | undefined;

    constructor(moduleName: string, logLevel: LogLevel, values: any[]) {
        this.moduleName = moduleName;
        this.logLevel = logLevel;
        this.values = values;
    }

    public setCallsite(callsite: StackFrame) {
        this.callsite = callsite;
    }

    public getCallsite() : StackFrame | undefined {
        return this.callsite;
    }

    public hasCallsite() : boolean {
        return this.callsite !== undefined;
    }

    public getValues() : any[] {
        return this.values;
    }

    public getModuleName() : string {
        return this.moduleName;
    }


    public getLogLevel() : LogLevelConfiguration {
        return levels.find(level => level.level === this.logLevel)!;
    }
}