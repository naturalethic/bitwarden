import { PasswordVerificationRequest } from './passwordVerificationRequest';
export declare class TwoFactorEmailRequest extends PasswordVerificationRequest {
    email: string;
    constructor(email: string, masterPasswordHash: string);
}
