import { I18nService } from '../../abstractions/i18n.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
export declare class ValidationService {
    private i18nService;
    private platformUtilsService;
    constructor(i18nService: I18nService, platformUtilsService: PlatformUtilsService);
    showError(data: any): string[];
}
