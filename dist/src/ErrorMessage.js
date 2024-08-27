import Callsite from './Callsite.js';
import RootPath from 'app-root-path';
import assert from 'assert';
import path from 'path';
// the singleton nanalyzer
// can eb used as singleton
const callsite = new Callsite();
export default class ErrorMessage {
    constructor(err) {
        assert(err instanceof Error, 'expected an error object');
        this.type = 'error';
        this.name = err.name;
        this.message = err.message;
        const frames = callsite.getFromError(err);
        if (Array.isArray(frames)) {
            this.frames = frames.map(frame => callsite.convertStackFrame(frame)).map(frame => {
                if (frame.fileName)
                    frame.fileName = this.truncatePath(frame.fileName);
                return frame;
            });
        }
        else {
            this.frames = frames;
        }
    }
    /**
    * truncate paths so that the part of the projects
    * directory is removed
    */
    truncatePath(filepath) {
        const thisdir = path.dirname(new URL(import.meta.url).pathname);
        const rootPath = RootPath.resolve(thisdir);
        // remove the project root
        if (filepath.startsWith(rootPath))
            filepath = filepath.substring(rootPath.length + 1);
        else if (filepath.startsWith(`file://${rootPath}`))
            filepath = filepath.substring(rootPath.length + 1 + 7);
        // check for node modules, remove that
        const index = filepath.lastIndexOf('node_modules');
        if (index >= 0)
            filepath = 'nm:' + filepath.substring(index + 'node_modules'.length);
        return filepath;
    }
}
//# sourceMappingURL=ErrorMessage.js.map