import { PasswordVerificationRequest } from './passwordVerificationRequest';
import { TwoFactorProviderType } from '../../enums/twoFactorProviderType';
export declare class TwoFactorProviderRequest extends PasswordVerificationRequest {
    type: TwoFactorProviderType;
}
