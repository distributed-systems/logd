import { ICallsite } from './Callsite.js';
import Logd, { LogLevel } from './Logd.js';
import Message from './Message.js';
export interface LogModuleOptions {
    moduleName: string;
    rootModule: Logd;
    parentFiles: string[];
    logLevels: LogLevel[];
}
export default class LogModule {
    moduleName: string;
    rootModule: Logd;
    parentFiles: string[];
    logLevels: LogLevel[];
    argvEnabled: boolean | null;
    enabledChildren: Map<string, boolean>;
    moduleIsEnabled: boolean | null;
    name: string;
    constructor({ moduleName, rootModule, parentFiles, logLevels }: LogModuleOptions);
    debug(...args: any[]): void;
    notice(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    wtf(...args: any[]): void;
    highlight(...args: any[]): void;
    success(...args: any[]): void;
    /**
    * handles log messages that were emittedd
    *
    * @param {object} message the messagfe to transmit
    */
    sendLogMessage(message: Message): void;
    /**
    * creates a log message that can be sent
    * to the transports
    *
    * @param {object} options
    *
    * @returns {object} message
    */
    createMessage({ type, level, args, callSite, moduleName }: {
        type: string;
        level: LogLevel;
        args: any[];
        callSite: ICallsite;
        moduleName: string;
    }): Message;
    /**
    * create a function for accesing a specific log
    * level handler function on the logging module
    *
    * @param {object} loglevel
    *
    * @returns {object} this
    */
    addLoglevelHandler(level: LogLevel, instance: Function): void;
    /**
    * determined if this module is currently active
    * and if the logs should be sent to the transports
    *
    * checks also if any of the parents is enabled, or disabled
    * depending if this module was explicitly activated or implicitly.
    * if a parent is enabled, and the the --children flags was
    * passed this module shall be enabled, if this module was explicitly
    * enabled and a parent was not enabled, this module should
    * also not be enabled except if the --children flag was enabled
    */
    getEnabledStatus(): boolean;
    /**
    * returne the status of the module
    *
    * @returns {boolean} status
    */
    isEnabled(): boolean;
    /**
    * returns the root logger
    *
    * @returns {object} logger
    */
    getRootModule(): Logd;
    /**
    * returns the name of this module
    *
    * @returns {string} moduleName
    */
    getName(): string;
    /**
    * returns the transports manager
    *
    * @returns {object} transports
    */
    getTransport(): import("./TransportManager.js").default;
    /**
    * returns the modules path map
    *
    * @returns {map} modules
    */
    getModulePathMap(): Map<string, LogModule>;
    /**
    * returns the availbale log levels
    *
    * @returns {map} logLevels
    */
    getLogLevels(): void;
    /**
    * checks if this module is enabled somehow via
    * process parameters
    *
    * @returns {boolean} true if enabled
    */
    isArgvEnabled(): boolean;
    /**
    * checks if this module has an enabled child
    *
    * @param {sttring} childName the name of the child to check for
    *
    * @returns {boolean}
    */
    hasEnabledChild(childName: string): boolean | undefined;
    /**
    * generates an uid
    *
    * @returns {string} uid
    */
    uid(): string;
}
//# sourceMappingURL=LogModule.d.ts.map