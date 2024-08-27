import TransportManager from "./TransportManager.js";
import LogModule from "./LogModule.js";
import Message from './Message.js';
export interface LogLevel {
    name: string;
    level: number;
}
export type LogLevels = LogLevel[];
export default class Logd {
    levelFrom: number;
    levelTo: number;
    private readonly logLevels;
    readonly pathMap: Map<string, LogModule>;
    private readonly transportManager;
    private readonly instance;
    constructor();
    /**
    * finds the current log levels to handle from the
    * processes arguments
    */
    getEnabledLogLevels(): void;
    /**
    * handles log messages that were emitted
    *
    * @param {object} message the message to transmit
    */
    sendLogMessage(message: Message): void;
    /**
    * register a new log level on the module
    * and its children if there are any
    *
    * @param {string} name the name fo the level
    * @param {number} level the integer level
    *
    * @returns {object} this
    */
    level(name: string, level?: number): this;
    /**
    * add a transport module
    *
    * @param {object} transportIntance an instance of a transport
    *
    * @returns {object} this
    */
    transport(transport: any): this;
    /**
    * returns the transport maneger
    *
    * @returns {object} transportmanager
    */
    getTransportManager(): TransportManager;
    /**
    * create a namespace for a module which can
    * be separately controlled
    *
    * @param {string} moduleName the name of the module
    *
    * @returns {object} logger module
    */
    module(moduleName: string, dontBustCache?: boolean): LogModule;
    /**
    * generates an uid
    *
    * @returns {string} uid
    */
    uid(): string;
}
//# sourceMappingURL=Logd.d.ts.map