import { TwoFactorProviderType } from '../../enums/twoFactorProviderType';
import { DeviceRequest } from './deviceRequest';
export declare class TokenRequest {
    email: string;
    masterPasswordHash: string;
    token: string;
    provider: TwoFactorProviderType;
    remember: boolean;
    device?: DeviceRequest;
    constructor(email: string, masterPasswordHash: string, provider: TwoFactorProviderType, token: string, remember: boolean, device?: DeviceRequest);
    toIdentityToken(clientId: string): any;
}
