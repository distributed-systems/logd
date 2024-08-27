import { ICallsite } from './Callsite.js';
export default class ErrorMessage {
    type: string;
    name: string;
    message: string;
    frames: ICallsite[];
    constructor(err: any);
    /**
    * truncate paths so that the part of the projects
    * directory is removed
    */
    truncatePath(filepath: string): string;
}
//# sourceMappingURL=ErrorMessage.d.ts.map