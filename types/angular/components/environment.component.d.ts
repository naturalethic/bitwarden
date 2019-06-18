import { EventEmitter } from '@angular/core';
import { EnvironmentService } from '../../abstractions/environment.service';
import { I18nService } from '../../abstractions/i18n.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
export declare class EnvironmentComponent {
    protected platformUtilsService: PlatformUtilsService;
    protected environmentService: EnvironmentService;
    protected i18nService: I18nService;
    onSaved: EventEmitter<{}>;
    iconsUrl: string;
    identityUrl: string;
    apiUrl: string;
    webVaultUrl: string;
    notificationsUrl: string;
    baseUrl: string;
    showCustom: boolean;
    constructor(platformUtilsService: PlatformUtilsService, environmentService: EnvironmentService, i18nService: I18nService);
    submit(): Promise<void>;
    toggleCustom(): void;
    protected saved(): void;
}
