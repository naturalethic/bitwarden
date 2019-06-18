import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CryptoService } from '../../abstractions/crypto.service';
import { EnvironmentService } from '../../abstractions/environment.service';
import { I18nService } from '../../abstractions/i18n.service';
import { LockService } from '../../abstractions/lock.service';
import { MessagingService } from '../../abstractions/messaging.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
import { StorageService } from '../../abstractions/storage.service';
import { UserService } from '../../abstractions/user.service';
export declare class LockComponent implements OnInit {
    protected router: Router;
    protected i18nService: I18nService;
    protected platformUtilsService: PlatformUtilsService;
    protected messagingService: MessagingService;
    protected userService: UserService;
    protected cryptoService: CryptoService;
    protected storageService: StorageService;
    protected lockService: LockService;
    protected environmentService: EnvironmentService;
    masterPassword: string;
    pin: string;
    showPassword: boolean;
    email: string;
    pinLock: boolean;
    webVaultHostname: string;
    protected successRoute: string;
    protected onSuccessfulSubmit: () => void;
    private invalidPinAttempts;
    private pinSet;
    constructor(router: Router, i18nService: I18nService, platformUtilsService: PlatformUtilsService, messagingService: MessagingService, userService: UserService, cryptoService: CryptoService, storageService: StorageService, lockService: LockService, environmentService: EnvironmentService);
    ngOnInit(): Promise<void>;
    submit(): Promise<void>;
    logOut(): Promise<void>;
    togglePassword(): void;
    private setKeyAndContinue;
    private doContinue;
}
