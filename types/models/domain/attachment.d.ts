import { AttachmentData } from '../data/attachmentData';
import { AttachmentView } from '../view/attachmentView';
import { CipherString } from './cipherString';
import Domain from './domainBase';
export declare class Attachment extends Domain {
    id: string;
    url: string;
    size: string;
    sizeName: string;
    key: CipherString;
    fileName: CipherString;
    constructor(obj?: AttachmentData, alreadyEncrypted?: boolean);
    decrypt(orgId: string): Promise<AttachmentView>;
    toAttachmentData(): AttachmentData;
}
