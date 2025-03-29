import Logger from './Logger.js';
import LogMessage, { LogLevel } from './LogMessage.js';
import { StackFrame } from 'error-stack-parser';

export default class BrowserLogger extends Logger {
    // Colors mapping similar to the terminal, using chalk-like strings.
    private readonly colors: Map<string, string> = new Map([
        ['debug', 'grey'],
        ['notice', 'grey'],
        ['info', 'white'],
        ['warn', 'yellow.bold'],
        ['error', 'red.bold'],
        ['success', 'green.bold'],
        ['highlight', 'cyan.bold'],
        ['wtf', 'magenta.bold.bgWhite'],
        ['default', 'blue.bold']
    ]);

    public log(message: LogMessage): void {
        // Create a timestamp in the format: dd HH:MM:SS.mss
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
        const timestamp = `${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

        // Get callsite info if available
        const callsite: StackFrame | undefined = message.getCallsite();
        const location = callsite ? `${callsite.fileName}:${callsite.lineNumber}` : 'unknown';

        // Get the module name and values to log
        const moduleName = message.getModuleName();
        const values = message.getValues();

        // Retrieve log level configuration
        const logLevel = message.getLogLevel().level;
        const style = this.getStyleForLevel(logLevel);

        // Build the formatted prefix
        const logPrefix = `${timestamp} > ${location} : [${moduleName}]:`;

        // Use %c to apply our custom style to the prefix text
        console.log(`%c${logPrefix}`, style, ...values);
    }

    /**
     * Converts our chalk-style color string (e.g. "yellow.bold" or "magenta.bold.bgWhite")
     * to a CSS style string for console styling.
     */
    private getStyleForLevel(level: string): string {
        const styleString = this.colors.get(level) || this.colors.get('default');
        let css = '';
        if (styleString) {
            const tokens = styleString.split('.');
            tokens.forEach(token => {
                if (token === 'bold') {
                    css += 'font-weight: bold;';
                } else if (token.startsWith('bg')) {
                    // For tokens like "bgWhite" we extract the color name after "bg"
                    const bgColor = token.slice(2).toLowerCase();
                    css += `background-color: ${bgColor};`;
                } else {
                    // Assume token is a color name
                    css += `color: ${token};`;
                }
            });
        }
        return css;
    }
}
