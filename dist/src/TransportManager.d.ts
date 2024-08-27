import Message from './Message.js';
export default class TransportManager {
    transports: Set<any>;
    levelMap: Map<any, any>;
    loglevels: Map<any, any>;
    constructor();
    sendMessage(message: Message): void;
    addLogLevelDescriptor(descriptor: any): void;
    computeRoutes(): void;
    computeRoute(transport: any): void;
    addTransportToLevel(transport: any, levelNumber: any): void;
    /**
    * add a transport
    *
    * @param {object} transportIntance an instance of a transport
    *
    * @returns {object} this
    */
    add(transportIntance: any): this;
}
//# sourceMappingURL=TransportManager.d.ts.map