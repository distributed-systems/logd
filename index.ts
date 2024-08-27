import Logd from "./src/Logd.js";
import Transport from "./src/Transport.js";
import TestTransport from './src/TestTransport.js';


let instance : Logd = new Logd();

export default instance;
export { Transport };

//instance.transport(new TestTransport());

//instance.module('test').success('test');