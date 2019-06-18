import { PasswordVerificationRequest } from './passwordVerificationRequest';
export declare class EmailTokenRequest extends PasswordVerificationRequest {
    newEmail: string;
    masterPasswordHash: string;
}
