import { TwoFactorProviderType } from '../enums/twoFactorProviderType';
import { AuthResult } from '../models/domain/authResult';
import { SymmetricCryptoKey } from '../models/domain/symmetricCryptoKey';
import { ApiService } from '../abstractions/api.service';
import { AppIdService } from '../abstractions/appId.service';
import { AuthService as AuthServiceAbstraction } from '../abstractions/auth.service';
import { CryptoService } from '../abstractions/crypto.service';
import { I18nService } from '../abstractions/i18n.service';
import { MessagingService } from '../abstractions/messaging.service';
import { PlatformUtilsService } from '../abstractions/platformUtils.service';
import { TokenService } from '../abstractions/token.service';
import { UserService } from '../abstractions/user.service';
export declare const TwoFactorProviders: {
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
export declare class AuthService implements AuthServiceAbstraction {
    private cryptoService;
    private apiService;
    private userService;
    private tokenService;
    private appIdService;
    private i18nService;
    private platformUtilsService;
    private messagingService;
    private setCryptoKeys;
    email: string;
    masterPasswordHash: string;
    twoFactorProvidersData: Map<TwoFactorProviderType, {
        [key: string]: string;
    }>;
    selectedTwoFactorProviderType: TwoFactorProviderType;
    private key;
    private kdf;
    private kdfIterations;
    constructor(cryptoService: CryptoService, apiService: ApiService, userService: UserService, tokenService: TokenService, appIdService: AppIdService, i18nService: I18nService, platformUtilsService: PlatformUtilsService, messagingService: MessagingService, setCryptoKeys?: boolean);
    init(): void;
    logIn(email: string, masterPassword: string): Promise<AuthResult>;
    logInTwoFactor(twoFactorProvider: TwoFactorProviderType, twoFactorToken: string, remember?: boolean): Promise<AuthResult>;
    logInComplete(email: string, masterPassword: string, twoFactorProvider: TwoFactorProviderType, twoFactorToken: string, remember?: boolean): Promise<AuthResult>;
    logOut(callback: Function): void;
    getSupportedTwoFactorProviders(win: Window): any[];
    getDefaultTwoFactorProvider(u2fSupported: boolean): TwoFactorProviderType;
    makePreloginKey(masterPassword: string, email: string): Promise<SymmetricCryptoKey>;
    private logInHelper;
    private clearState;
}
