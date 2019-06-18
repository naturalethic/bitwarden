import { PasswordVerificationRequest } from './passwordVerificationRequest';
export declare class PasswordRequest extends PasswordVerificationRequest {
    newMasterPasswordHash: string;
    key: string;
}
