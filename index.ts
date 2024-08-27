import Logd from "./src/Logd.js";
import Message from './src/Message.js';
import Transport from "./src/Transport.js";


let instance : Logd = new Logd();

export default instance;
export { Transport, Message };

//instance.transport(new TestTransport());

//instance.module('test').success('test');