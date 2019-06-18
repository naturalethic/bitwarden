import { SecureNoteType } from '../../enums/secureNoteType';
import { SecureNoteData } from '../data/secureNoteData';
import Domain from './domainBase';
import { SecureNoteView } from '../view/secureNoteView';
export declare class SecureNote extends Domain {
    type: SecureNoteType;
    constructor(obj?: SecureNoteData, alreadyEncrypted?: boolean);
    decrypt(orgId: string): Promise<SecureNoteView>;
    toSecureNoteData(): SecureNoteData;
}
