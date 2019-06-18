import { TwoFactorProviderType } from '../../enums/twoFactorProviderType';
export declare class AuthResult {
    twoFactor: boolean;
    twoFactorProviders: Map<TwoFactorProviderType, {
        [key: string]: string;
    }>;
}
