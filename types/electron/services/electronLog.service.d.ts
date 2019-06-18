import { LogLevelType } from '../../enums/logLevelType';
import { LogService as LogServiceAbstraction } from '../../abstractions/log.service';
export declare class ElectronLogService implements LogServiceAbstraction {
    private filter;
    constructor(filter?: (level: LogLevelType) => boolean, logDir?: string);
    debug(message: string): void;
    info(message: string): void;
    warning(message: string): void;
    error(message: string): void;
    write(level: LogLevelType, message: string): void;
}
