import { PasswordVerificationRequest } from './passwordVerificationRequest';
export declare class TwoFactorRecoveryRequest extends PasswordVerificationRequest {
    recoveryCode: string;
    email: string;
}
