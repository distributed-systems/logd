import Logd from "./src/Logd.js";
import Message from './src/Message.js';
import Transport from "./src/Transport.js";
let instance = new Logd();
export default instance;
export { Transport, Message };
//instance.transport(new TestTransport());
//instance.module('test').success('test');
//# sourceMappingURL=index.js.map