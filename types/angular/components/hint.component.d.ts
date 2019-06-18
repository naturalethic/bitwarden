import { Router } from '@angular/router';
import { ApiService } from '../../abstractions/api.service';
import { I18nService } from '../../abstractions/i18n.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
export declare class HintComponent {
    protected router: Router;
    protected i18nService: I18nService;
    protected apiService: ApiService;
    protected platformUtilsService: PlatformUtilsService;
    email: string;
    formPromise: Promise<any>;
    protected successRoute: string;
    protected onSuccessfulSubmit: () => void;
    constructor(router: Router, i18nService: I18nService, apiService: ApiService, platformUtilsService: PlatformUtilsService);
    submit(): Promise<void>;
}
