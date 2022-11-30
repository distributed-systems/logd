import Transport from './Transport.d.ts';
import LogModule from './LogModule.d.ts';


export interface Logd {
    module(): LogModule;
    level() : Logd;
    transport(transport: Transport) : Logd
    module(moduleName: string) : LogModule;
}