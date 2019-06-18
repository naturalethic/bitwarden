import { OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TwoFactorProviderType } from '../../enums/twoFactorProviderType';
import { ApiService } from '../../abstractions/api.service';
import { AuthService } from '../../abstractions/auth.service';
import { EnvironmentService } from '../../abstractions/environment.service';
import { I18nService } from '../../abstractions/i18n.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
import { U2f } from '../../misc/u2f';
export declare class TwoFactorComponent implements OnInit, OnDestroy {
    protected authService: AuthService;
    protected router: Router;
    protected i18nService: I18nService;
    protected apiService: ApiService;
    protected platformUtilsService: PlatformUtilsService;
    protected win: Window;
    protected environmentService: EnvironmentService;
    token: string;
    remember: boolean;
    u2fReady: boolean;
    providers: {
        [TwoFactorProviderType.Authenticator]: {
            type: TwoFactorProviderType;
            name: string;
            description: string;
            priority: number;
            sort: number;
            premium: boolean;
        };
        [TwoFactorProviderType.Yubikey]: {
            type: TwoFactorProviderType;
            name: string;
            description: string;
            priority: number;
            sort: number;
            premium: boolean;
        };
        [TwoFactorProviderType.Duo]: {
            type: TwoFactorProviderType;
            name: string;
            description: string;
            priority: number;
            sort: number;
            premium: boolean;
        };
        [TwoFactorProviderType.OrganizationDuo]: {
            type: TwoFactorProviderType;
            name: string;
            description: string;
            priority: number;
            sort: number;
            premium: boolean;
        };
        [TwoFactorProviderType.U2f]: {
            type: TwoFactorProviderType;
            name: string;
            description: string;
            priority: number;
            sort: number;
            premium: boolean;
        };
        [TwoFactorProviderType.Email]: {
            type: TwoFactorProviderType;
            name: string;
            description: string;
            priority: number;
            sort: number;
            premium: boolean;
        };
    };
    providerType: typeof TwoFactorProviderType;
    selectedProviderType: TwoFactorProviderType;
    u2fSupported: boolean;
    u2f: U2f;
    title: string;
    twoFactorEmail: string;
    formPromise: Promise<any>;
    emailPromise: Promise<any>;
    onSuccessfulLogin: () => Promise<any>;
    onSuccessfulLoginNavigate: () => Promise<any>;
    protected loginRoute: string;
    protected successRoute: string;
    constructor(authService: AuthService, router: Router, i18nService: I18nService, apiService: ApiService, platformUtilsService: PlatformUtilsService, win: Window, environmentService: EnvironmentService);
    ngOnInit(): Promise<void>;
    ngOnDestroy(): void;
    init(): Promise<void>;
    submit(): Promise<void>;
    sendEmail(doToast: boolean): Promise<void>;
    private cleanupU2f;
}
