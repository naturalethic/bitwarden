import { CipherType } from '../../enums/cipherType';
import { Cipher } from '../domain/cipher';
import { CardApi } from '../api/cardApi';
import { FieldApi } from '../api/fieldApi';
import { IdentityApi } from '../api/identityApi';
import { LoginApi } from '../api/loginApi';
import { SecureNoteApi } from '../api/secureNoteApi';
import { AttachmentRequest } from './attachmentRequest';
import { PasswordHistoryRequest } from './passwordHistoryRequest';
export declare class CipherRequest {
    type: CipherType;
    folderId: string;
    organizationId: string;
    name: string;
    notes: string;
    favorite: boolean;
    login: LoginApi;
    secureNote: SecureNoteApi;
    card: CardApi;
    identity: IdentityApi;
    fields: FieldApi[];
    passwordHistory: PasswordHistoryRequest[];
    attachments: {
        [id: string]: string;
    };
    attachments2: {
        [id: string]: AttachmentRequest;
    };
    constructor(cipher: Cipher);
}
