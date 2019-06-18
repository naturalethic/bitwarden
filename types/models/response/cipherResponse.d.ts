import { AttachmentResponse } from './attachmentResponse';
import { BaseResponse } from './baseResponse';
import { PasswordHistoryResponse } from './passwordHistoryResponse';
import { CardApi } from '../api/cardApi';
import { FieldApi } from '../api/fieldApi';
import { IdentityApi } from '../api/identityApi';
import { LoginApi } from '../api/loginApi';
import { SecureNoteApi } from '../api/secureNoteApi';
export declare class CipherResponse extends BaseResponse {
    id: string;
    organizationId: string;
    folderId: string;
    type: number;
    name: string;
    notes: string;
    fields: FieldApi[];
    login: LoginApi;
    card: CardApi;
    identity: IdentityApi;
    secureNote: SecureNoteApi;
    favorite: boolean;
    edit: boolean;
    organizationUseTotp: boolean;
    revisionDate: string;
    attachments: AttachmentResponse[];
    passwordHistory: PasswordHistoryResponse[];
    collectionIds: string[];
    constructor(response: any);
}
