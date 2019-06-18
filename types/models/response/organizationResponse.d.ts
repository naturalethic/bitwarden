import { BaseResponse } from './baseResponse';
import { PlanType } from '../../enums/planType';
export declare class OrganizationResponse extends BaseResponse {
    id: string;
    name: string;
    businessName: string;
    businessAddress1: string;
    businessAddress2: string;
    businessAddress3: string;
    businessCountry: string;
    businessTaxNumber: string;
    billingEmail: string;
    plan: string;
    planType: PlanType;
    seats: number;
    maxCollections: number;
    maxStorageGb: number;
    useGroups: boolean;
    useDirectory: boolean;
    useEvents: boolean;
    useTotp: boolean;
    use2fa: boolean;
    useApi: boolean;
    constructor(response: any);
}
