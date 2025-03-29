import Logd from './src/Logd.js';

let logd : Logd;
if (typeof window !== 'undefined') {
    // @ts-ignore
    if (!window.__logd) {
        // @ts-ignore
        window.__logd = new Logd();
    }
    // @ts-ignore
    logd = window.__logd;
} else {
    // @ts-ignore
    if (!global.__logd) {
        // @ts-ignore
        global.__logd = new Logd();
    }
    // @ts-ignore
    logd =  global.__logd;
}

export default logd;
import LogMessage from './src/LogMessage.js';
export { LogMessage };