import { PasswordVerificationRequest } from './passwordVerificationRequest';
export declare class UpdateTwoFactorYubioOtpRequest extends PasswordVerificationRequest {
    key1: string;
    key2: string;
    key3: string;
    key4: string;
    key5: string;
    nfc: boolean;
}
