import { SecureNoteType } from '../../enums/secureNoteType';
import { SecureNoteApi } from '../api/secureNoteApi';
export declare class SecureNoteData {
    type: SecureNoteType;
    constructor(data?: SecureNoteApi);
}
