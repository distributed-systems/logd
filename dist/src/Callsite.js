import assert from 'assert';
export default class CallSite {
    /**
    * returns a serializable frame
    *
    * @param {object} frame v8 callsit object
    *
    * @returns {object} frame
    */
    convertStackFrame(frame) {
        const callsite = (typeof frame === 'object') ? {
            type: frame.getTypeName(),
            function: frame.getFunctionName(),
            method: frame.getMethodName(),
            fileName: frame.getFileName(),
            lineNumber: frame.getLineNumber(),
            character: frame.getColumnNumber(),
            message: frame.toString()
        } : {
            type: null,
            function: null,
            method: null,
            fileName: 'n/a',
            lineNumber: '',
            character: '',
            message: '-'
        };
        return callsite;
    }
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
    getFromError(err, slice = 0, limit = 20) {
        assert(err, 'expected an error object');
        assert(err instanceof Error, 'expected an error object');
        // return unqiue files
        return this.getCallSite(slice, limit, err);
    }
    /**
    * gets the call site of a specific frame
    *
    * @param {number} slice the numebr of frames to remove of the top
    * @param {numebr} limit how many frames to get
    *
    * @returns {set} list containing filepaths
    */
    getCaller(slice = 0, limit = 5) {
        return this.getCallSite(slice, limit).slice(0, 1)[0];
    }
    /**
    * gets all files called before
    *
    * @param {number} slice the numebr of frames to remove of the top
    * @param {numebr} limit how many frames to get
    *
    * @returns {set} list containing filepaths
    */
    getParentFiles(slice = 0, limit = Infinity) {
        const set = new Set();
        // egt unique files
        this.getCallSite(slice, limit).forEach(s => set.add(s.getFileName()));
        // return unqiue files
        return Array.from(set);
    }
    /**
    * gets the callsite object
    *
    * @param {number} slice the numebr of frames to remove of the top
    * @param {numebr} limit how many frames to get
    *
    * @returns {array} stack
    */
    getCallSite(slice = 0, limit = 10, err) {
        const originalFunction = Error.prepareStackTrace;
        const originalLimit = Error.stackTraceLimit;
        Error.stackTraceLimit = limit;
        Error.prepareStackTrace = (originalFunction, stack) => stack;
        // @ts-ignore
        const stack = (err || new Error()).stack.slice((err ? 0 : 2) + slice);
        // revert
        Error.prepareStackTrace = originalFunction;
        Error.stackTraceLimit = originalLimit;
        // return unqiue files
        return stack;
    }
}
;
//# sourceMappingURL=Callsite.js.map