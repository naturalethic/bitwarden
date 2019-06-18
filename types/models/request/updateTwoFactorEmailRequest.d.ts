import { PasswordVerificationRequest } from './passwordVerificationRequest';
export declare class UpdateTwoFactorEmailRequest extends PasswordVerificationRequest {
    token: string;
    email: string;
}
