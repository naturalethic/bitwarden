import * as program from 'commander';
import { I18nService } from '../../abstractions/i18n.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
import { Response } from '../models/response';
export declare class UpdateCommand {
    private platformUtilsService;
    private i18nService;
    private repoName;
    private executableName;
    private showExtendedMessage;
    inPkg: boolean;
    constructor(platformUtilsService: PlatformUtilsService, i18nService: I18nService, repoName: string, executableName: string, showExtendedMessage: boolean);
    run(cmd: program.Command): Promise<Response>;
}
