import { OrganizationData } from '../data/organizationData';
import { OrganizationUserStatusType } from '../../enums/organizationUserStatusType';
import { OrganizationUserType } from '../../enums/organizationUserType';
export declare class Organization {
    id: string;
    name: string;
    status: OrganizationUserStatusType;
    type: OrganizationUserType;
    enabled: boolean;
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
    constructor(obj?: OrganizationData);
    readonly canAccess: boolean;
    readonly isManager: boolean;
    readonly isAdmin: boolean;
    readonly isOwner: boolean;
}
