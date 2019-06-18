import { BaseResponse } from './baseResponse';
export declare class BreachAccountResponse extends BaseResponse {
    addedDate: string;
    breachDate: string;
    dataClasses: string[];
    description: string;
    domain: string;
    isActive: boolean;
    isVerified: boolean;
    logoPath: string;
    modifiedDate: string;
    name: string;
    pwnCount: number;
    title: string;
    constructor(response: any);
}
