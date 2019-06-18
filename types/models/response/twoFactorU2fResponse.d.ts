import { BaseResponse } from './baseResponse';
export declare class TwoFactorU2fResponse extends BaseResponse {
    enabled: boolean;
    keys: KeyResponse[];
    constructor(response: any);
}
export declare class KeyResponse extends BaseResponse {
    name: string;
    id: number;
    compromised: boolean;
    constructor(response: any);
}
export declare class ChallengeResponse extends BaseResponse {
    userId: string;
    appId: string;
    challenge: string;
    version: string;
    constructor(response: any);
}
