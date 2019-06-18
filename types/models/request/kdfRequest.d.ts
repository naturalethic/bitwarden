import { PasswordRequest } from './passwordRequest';
import { KdfType } from '../../enums/kdfType';
export declare class KdfRequest extends PasswordRequest {
    kdf: KdfType;
    kdfIterations: number;
}
