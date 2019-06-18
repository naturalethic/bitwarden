import { PasswordVerificationRequest } from './passwordVerificationRequest';
export declare class UpdateTwoFactorAuthenticatorRequest extends PasswordVerificationRequest {
    token: string;
    key: string;
}
