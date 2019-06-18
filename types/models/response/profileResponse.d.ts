import { BaseResponse } from './baseResponse';
import { ProfileOrganizationResponse } from './profileOrganizationResponse';
export declare class ProfileResponse extends BaseResponse {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    masterPasswordHint: string;
    premium: boolean;
    culture: string;
    twoFactorEnabled: boolean;
    key: string;
    privateKey: string;
    securityStamp: string;
    organizations: ProfileOrganizationResponse[];
    constructor(response: any);
}
