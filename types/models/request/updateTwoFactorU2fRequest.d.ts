import { PasswordVerificationRequest } from './passwordVerificationRequest';
export declare class UpdateTwoFactorU2fRequest extends PasswordVerificationRequest {
    deviceResponse: string;
    name: string;
    id: number;
}
