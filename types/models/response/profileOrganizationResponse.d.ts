import { BaseResponse } from './baseResponse';
import { OrganizationUserStatusType } from '../../enums/organizationUserStatusType';
import { OrganizationUserType } from '../../enums/organizationUserType';
export declare class ProfileOrganizationResponse extends BaseResponse {
    id: string;
    name: string;
    useGroups: boolean;
    useDirectory: boolean;
    useEvents: boolean;
    useTotp: boolean;
    use2fa: boolean;
    useApi: boolean;
    selfHost: boolean;
    usersGetPremium: boolean;
    seats: number;
    maxCollections: number;
    maxStorageGb?: number;
    key: string;
    status: OrganizationUserStatusType;
    type: OrganizationUserType;
    enabled: boolean;
    constructor(response: any);
}
