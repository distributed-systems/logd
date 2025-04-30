import Logger from './Logger.js';
import LogMessage, { levels, LogLevel } from './LogMessage.js';
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

    private _logsEnabled: boolean = false;
    private _enabledLogLevel: number = 0;
    private readonly STORAGE_KEY = 'logd_config';

    constructor() {
        super();

        // Load configuration from localStorage
        const storedConfig = localStorage.getItem(this.STORAGE_KEY);
        if (storedConfig) {
            const config = JSON.parse(storedConfig);
            this._logsEnabled = config.enabled;
            this._enabledLogLevel = config.level;
        }

        // @ts-ignore
        window.logd = {
            enable: (level?: string) => {
                this._logsEnabled = true;
                if (level) {
                    const levelConfig = levels.find(l => l.level === level);
                    if (levelConfig) {
                        this._enabledLogLevel = levelConfig.value;
                    }
                }
                this.saveConfig();
            },
            disable: () => {
                this._logsEnabled = false;
                this.saveConfig();
            },
        };
    }

    private saveConfig(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
            enabled: this._logsEnabled,
            level: this._enabledLogLevel
        }));
    }

    public getEnabledLogLevel() : number {
        return this._enabledLogLevel;
    }

    public logsEnabled() : boolean {
        return this._logsEnabled;
    }

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
