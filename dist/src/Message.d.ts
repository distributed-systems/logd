import { ICallsite } from './Callsite.js';
import { LogLevel } from './Logd.js';
export default class Message {
    type: string;
    moduleName: string;
    data: any[];
    uid: string;
    callsite: ICallsite;
    level: LogLevel;
    constructor(type: string, moduleName: string);
    /**
* lets the user mark the message with an uid
*
* @param {string} uid
*
* @returns {object} this
*/
    setUId(uid: string): this;
    /**
    * set the callsite of the originator
    *
    * @param {object} frame v8 callsit object
    *
    * @returns {object} this
    */
    setCallSite(frame: any): this;
    /**
    * define the level of this message
    *
    * @param {object} level the level definition
    *
    * @returns {object} this
    */
    setLevel(level: LogLevel): this;
    /**
    * returns the level this message is intended for
    *
    * @returns {number} level
    */
    getLevelNumber(): number;
    /**
    * stores a junks of data on the message
    *
    * @param {*} data the data to add
    *
    * @returns {object} this
    */
    addData(data: any): this;
    /**
    * stores a junks of data on the message
    * the junks has already a type
    *
    * @param {*} data the data to add
    *
    * @returns {object} this
    */
    addDataObject(data: any): this;
}
//# sourceMappingURL=Message.d.ts.map