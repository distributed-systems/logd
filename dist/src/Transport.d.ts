import Message from './Message.js';
export interface ILogLevel {
    type: string;
    from?: number;
    to?: number;
    default?: boolean;
    name?: string;
    modifier?: string;
}
export default class Transport {
    levels: ILogLevel[];
    locked: boolean;
    constructor();
    /**
    * got a message, got to do something with it
    *
    * @param {object} message
    */
    message(message: Message): void;
    /**
    * lock the transport so that the levels
    * cannot be edited anymore
    *
    * @returns {obejct} this
    */
    lock(): void;
    /**
    * returns the level descriptors
    *
    * @returns {array} levels
    */
    getLevels(): ILogLevel[];
    /**
    * enables certain levels on this transport
    *
    * @param {string} levels one or more level stings
    *
    * @returns {object} this
    */
    level(...levels: string[]): this;
}
//# sourceMappingURL=Transport.d.ts.map