import * as program from 'commander';
import { ApiService } from '../../abstractions/api.service';
import { AuthService } from '../../abstractions/auth.service';
import { I18nService } from '../../abstractions/i18n.service';
import { Response } from '../models/response';
import { MessageResponse } from '../models/response/messageResponse';
export declare class LoginCommand {
    protected authService: AuthService;
    protected apiService: ApiService;
    protected i18nService: I18nService;
    protected validatedParams: () => Promise<any>;
    protected success: () => Promise<MessageResponse>;
    constructor(authService: AuthService, apiService: ApiService, i18nService: I18nService);
    run(email: string, password: string, cmd: program.Command): Promise<Response>;
}
