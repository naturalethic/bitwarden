"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_log_1 = require("electron-log");
const path = require("path");
const utils_1 = require("../utils");
const logLevelType_1 = require("../../enums/logLevelType");
class ElectronLogService {
    constructor(filter = null, logDir = null) {
        this.filter = filter;
        if (electron_log_1.default.transports == null) {
            return;
        }
        electron_log_1.default.transports.file.level = 'info';
        if (logDir != null) {
            electron_log_1.default.transports.file.file = path.join(logDir, 'app.log');
        }
    }
    debug(message) {
        if (!utils_1.isDev()) {
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
                electron_log_1.default.debug(message);
                break;
            case logLevelType_1.LogLevelType.Info:
                electron_log_1.default.info(message);
                break;
            case logLevelType_1.LogLevelType.Warning:
                electron_log_1.default.warn(message);
                break;
            case logLevelType_1.LogLevelType.Error:
                electron_log_1.default.error(message);
                break;
            default:
                break;
        }
    }
}
exports.ElectronLogService = ElectronLogService;
//# sourceMappingURL=electronLog.service.js.map