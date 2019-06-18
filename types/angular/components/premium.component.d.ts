import { OnInit } from '@angular/core';
import { ApiService } from '../../abstractions/api.service';
import { I18nService } from '../../abstractions/i18n.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
import { TokenService } from '../../abstractions/token.service';
export declare class PremiumComponent implements OnInit {
    protected i18nService: I18nService;
    protected platformUtilsService: PlatformUtilsService;
    protected tokenService: TokenService;
    protected apiService: ApiService;
    isPremium: boolean;
    price: number;
    refreshPromise: Promise<any>;
    constructor(i18nService: I18nService, platformUtilsService: PlatformUtilsService, tokenService: TokenService, apiService: ApiService);
    ngOnInit(): Promise<void>;
    refresh(): Promise<void>;
    purchase(): Promise<void>;
    manage(): Promise<void>;
}
