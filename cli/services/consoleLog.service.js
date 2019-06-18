"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logLevelType_1 = require("../../enums/logLevelType");
class ConsoleLogService {
    constructor(isDev, filter = null) {
        this.isDev = isDev;
        this.filter = filter;
    }
    debug(message) {
        if (!this.isDev) {
            return;
        }
        this.write(logLevelType_1.LogLevelType.Debug, message);
    }
    info(message) {
        this.write(logLevelType_1.LogLevelType.Info, message);
    }
    warning(message) {
        this.write(logLevelType_1.LogLevelType.Warning, message);
    }
    error(message) {
        this.write(logLevelType_1.LogLevelType.Error, message);
    }
    write(level, message) {
        if (this.filter != null && this.filter(level)) {
            return;
        }
        switch (level) {
            case logLevelType_1.LogLevelType.Debug:
                // tslint:disable-next-line
                console.log(message);
                break;
            case logLevelType_1.LogLevelType.Info:
                // tslint:disable-next-line
                console.log(message);
                break;
            case logLevelType_1.LogLevelType.Warning:
                // tslint:disable-next-line
                console.warn(message);
                break;
            case logLevelType_1.LogLevelType.Error:
                // tslint:disable-next-line
                console.error(message);
                break;
            default:
                break;
        }
    }
}
exports.ConsoleLogService = ConsoleLogService;
//# sourceMappingURL=consoleLog.service.js.map