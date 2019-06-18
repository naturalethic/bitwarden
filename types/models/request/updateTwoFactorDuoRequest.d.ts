import { PasswordVerificationRequest } from './passwordVerificationRequest';
export declare class UpdateTwoFactorDuoRequest extends PasswordVerificationRequest {
    integrationKey: string;
    secretKey: string;
    host: string;
}
