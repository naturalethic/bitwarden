import { BaseResponse } from './baseResponse';
import { TwoFactorProviderType } from '../../enums/twoFactorProviderType';
export declare class TwoFactorProviderResponse extends BaseResponse {
    enabled: boolean;
    type: TwoFactorProviderType;
    constructor(response: any);
}
