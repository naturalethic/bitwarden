import { StorageService } from '../abstractions/storage.service';
import { TokenService } from '../abstractions/token.service';
import { UserService as UserServiceAbstraction } from '../abstractions/user.service';
import { OrganizationData } from '../models/data/organizationData';
import { Organization } from '../models/domain/organization';
import { KdfType } from '../enums/kdfType';
export declare class UserService implements UserServiceAbstraction {
    private tokenService;
    private storageService;
    private userId;
    private email;
    private stamp;
    private kdf;
    private kdfIterations;
    constructor(tokenService: TokenService, storageService: StorageService);
    setInformation(userId: string, email: string, kdf: KdfType, kdfIterations: number): Promise<any>;
    setSecurityStamp(stamp: string): Promise<any>;
    getUserId(): Promise<string>;
    getEmail(): Promise<string>;
    getSecurityStamp(): Promise<string>;
    getKdf(): Promise<KdfType>;
    getKdfIterations(): Promise<number>;
    clear(): Promise<any>;
    isAuthenticated(): Promise<boolean>;
    canAccessPremium(): Promise<boolean>;
    getOrganization(id: string): Promise<Organization>;
    getAllOrganizations(): Promise<Organization[]>;
    replaceOrganizations(organizations: {
        [id: string]: OrganizationData;
    }): Promise<any>;
    clearOrganizations(userId: string): Promise<any>;
}
