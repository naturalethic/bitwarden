import { LogLevelType } from '../../enums/logLevelType';
import { LogService as LogServiceAbstraction } from '../../abstractions/log.service';
export declare class ConsoleLogService implements LogServiceAbstraction {
    private isDev;
    private filter;
    constructor(isDev: boolean, filter?: (level: LogLevelType) => boolean);
    debug(message: string): void;
    info(message: string): void;
    warning(message: string): void;
    error(message: string): void;
    write(level: LogLevelType, message: string): void;
}
