import { BaseResponse } from './baseResponse';
export declare class AttachmentResponse extends BaseResponse {
    id: string;
    url: string;
    fileName: string;
    key: string;
    size: string;
    sizeName: string;
    constructor(response: any);
}
