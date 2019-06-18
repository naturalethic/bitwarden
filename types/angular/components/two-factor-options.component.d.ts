import { EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TwoFactorProviderType } from '../../enums/twoFactorProviderType';
import { AuthService } from '../../abstractions/auth.service';
import { I18nService } from '../../abstractions/i18n.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
export declare class TwoFactorOptionsComponent implements OnInit {
    protected authService: AuthService;
    protected router: Router;
    protected i18nService: I18nService;
    protected platformUtilsService: PlatformUtilsService;
    protected win: Window;
    onProviderSelected: EventEmitter<TwoFactorProviderType>;
    onRecoverSelected: EventEmitter<{}>;
    providers: any[];
    constructor(authService: AuthService, router: Router, i18nService: I18nService, platformUtilsService: PlatformUtilsService, win: Window);
    ngOnInit(): void;
    choose(p: any): void;
    recover(): void;
}
