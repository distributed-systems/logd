import Message from './Message.js';
export default class MessageWrapper {
    message?: Message;
    constructor(message?: Message);
    /**
    * lets the user mark the message withan uid
    *
    * @param {string} uid
    *
    * @returns {object} this
    */
    uid(uid: string): this;
}
//# sourceMappingURL=MessageWrapper.d.ts.map