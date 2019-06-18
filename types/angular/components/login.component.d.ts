import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResult } from '../../models/domain/authResult';
import { AuthService } from '../../abstractions/auth.service';
import { I18nService } from '../../abstractions/i18n.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
import { StorageService } from '../../abstractions/storage.service';
export declare class LoginComponent implements OnInit {
    protected authService: AuthService;
    protected router: Router;
    protected platformUtilsService: PlatformUtilsService;
    protected i18nService: I18nService;
    private storageService;
    email: string;
    rememberEmail: boolean;
    masterPassword: string;
    showPassword: boolean;
    formPromise: Promise<AuthResult>;
    onSuccessfulLogin: () => Promise<any>;
    onSuccessfulLoginNavigate: () => Promise<any>;
    onSuccessfulLoginTwoFactorNavigate: () => Promise<any>;
    protected twoFactorRoute: string;
    protected successRoute: string;
    constructor(authService: AuthService, router: Router, platformUtilsService: PlatformUtilsService, i18nService: I18nService, storageService: StorageService);
    ngOnInit(): Promise<void>;
    submit(): Promise<void>;
    togglePassword(): void;
}
