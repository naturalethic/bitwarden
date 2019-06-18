import { OrganizationUserStatusType } from '../../enums/organizationUserStatusType';
import { OrganizationUserType } from '../../enums/organizationUserType';
import { BaseResponse } from './baseResponse';
import { SelectionReadOnlyResponse } from './selectionReadOnlyResponse';
export declare class OrganizationUserResponse extends BaseResponse {
    id: string;
    userId: string;
    type: OrganizationUserType;
    status: OrganizationUserStatusType;
    accessAll: boolean;
    constructor(response: any);
}
export declare class OrganizationUserUserDetailsResponse extends OrganizationUserResponse {
    name: string;
    email: string;
    twoFactorEnabled: string;
    constructor(response: any);
}
export declare class OrganizationUserDetailsResponse extends OrganizationUserResponse {
    collections: SelectionReadOnlyResponse[];
    constructor(response: any);
}
