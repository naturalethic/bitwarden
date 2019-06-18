import { View } from './view';
import { Attachment } from '../domain/attachment';
import { SymmetricCryptoKey } from '../domain/symmetricCryptoKey';
export declare class AttachmentView implements View {
    id: string;
    url: string;
    size: string;
    sizeName: string;
    fileName: string;
    key: SymmetricCryptoKey;
    constructor(a?: Attachment);
    readonly fileSize: number;
}
