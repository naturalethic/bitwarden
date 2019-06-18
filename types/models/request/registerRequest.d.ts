import { KeysRequest } from './keysRequest';
import { KdfType } from '../../enums/kdfType';
export declare class RegisterRequest {
    name: string;
    email: string;
    masterPasswordHash: string;
    masterPasswordHint: string;
    key: string;
    keys: KeysRequest;
    token: string;
    organizationUserId: string;
    kdf: KdfType;
    kdfIterations: number;
    constructor(email: string, name: string, masterPasswordHash: string, masterPasswordHint: string, key: string, kdf: KdfType, kdfIterations: number);
}
