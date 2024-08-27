export interface ICallsite {
    type: string;
    function: string;
    method: string;
    fileName: string;
    lineNumber: number;
    character: number;
    message: string;
}
export default class CallSite {
    /**
    * returns a serializable frame
    *
    * @param {object} frame v8 callsit object
    *
    * @returns {object} frame
    */
    convertStackFrame(frame: any): ICallsite;
    /**
    * returns the callsites for an error object, but only
    * if the stack wasnt accessed before
    *
    * @param {error} err error object
    * @param {number} slice the numebr of frames to remove of the top
    * @param {numebr} limit how many frames to get
    *
    * @returns {array} stack
    */
    getFromError(err: Error, slice?: number, limit?: number): ICallsite[];
    /**
    * gets the call site of a specific frame
    *
    * @param {number} slice the numebr of frames to remove of the top
    * @param {numebr} limit how many frames to get
    *
    * @returns {set} list containing filepaths
    */
    getCaller(slice?: number, limit?: number): ICallsite;
    /**
    * gets all files called before
    *
    * @param {number} slice the numebr of frames to remove of the top
    * @param {numebr} limit how many frames to get
    *
    * @returns {set} list containing filepaths
    */
    getParentFiles(slice?: number, limit?: number): string[];
    /**
    * gets the callsite object
    *
    * @param {number} slice the numebr of frames to remove of the top
    * @param {numebr} limit how many frames to get
    *
    * @returns {array} stack
    */
    getCallSite(slice?: number, limit?: number, err?: Error): any[];
}
//# sourceMappingURL=Callsite.d.ts.map