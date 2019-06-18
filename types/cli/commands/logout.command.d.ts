import * as program from 'commander';
import { AuthService } from '../../abstractions/auth.service';
import { I18nService } from '../../abstractions/i18n.service';
import { Response } from '../models/response';
export declare class LogoutCommand {
    private authService;
    private i18nService;
    private logoutCallback;
    constructor(authService: AuthService, i18nService: I18nService, logoutCallback: () => Promise<void>);
    run(cmd: program.Command): Promise<Response>;
}
