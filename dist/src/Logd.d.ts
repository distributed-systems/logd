import LogdModule from './LogdModule.js';
import LogMessage from './LogMessage.js';
export default class Logd {
    private readonly env;
    private readonly logger;
    private readonly messageQueue;
    constructor();
    module(name: string): LogdModule;
    logMessage(message: LogMessage): void;
}
//# sourceMappingURL=Logd.d.ts.map