import Message from './Message.js';


export default class MessageWrapper {


    message?: Message;


    constructor(message?: Message) {
        if(message) this.message = message;
    }








    /**
    * lets the user mark the message withan uid
    *
    * @param {string} uid
    *
    * @returns {object} this
    */
    uid(uid: string) {
        if (this.message) this.message.setUId(uid);
        return this;
    }
}