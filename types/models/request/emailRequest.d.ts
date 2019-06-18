import { EmailTokenRequest } from './emailTokenRequest';
export declare class EmailRequest extends EmailTokenRequest {
    newMasterPasswordHash: string;
    token: string;
    key: string;
}
