import { BaseResponse } from './baseResponse';
import { TwoFactorProviderType } from '../../enums/twoFactorProviderType';
export declare class IdentityTwoFactorResponse extends BaseResponse {
    twoFactorProviders: TwoFactorProviderType[];
    twoFactorProviders2: Map<TwoFactorProviderType, {
        [key: string]: string;
    }>;
    constructor(response: any);
}
