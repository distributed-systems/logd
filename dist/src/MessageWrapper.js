export default class MessageWrapper {
    constructor(message) {
        if (message)
            this.message = message;
    }
    /**
    * lets the user mark the message withan uid
    *
    * @param {string} uid
    *
    * @returns {object} this
    */
    uid(uid) {
        if (this.message)
            this.message.setUId(uid);
        return this;
    }
}
//# sourceMappingURL=MessageWrapper.js.map