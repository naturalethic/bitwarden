import { AttachmentResponse } from '../response/attachmentResponse';
export declare class AttachmentData {
    id: string;
    url: string;
    fileName: string;
    key: string;
    size: string;
    sizeName: string;
    constructor(response?: AttachmentResponse);
}
