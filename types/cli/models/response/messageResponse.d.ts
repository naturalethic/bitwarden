import { BaseResponse } from './baseResponse';
export declare class MessageResponse implements BaseResponse {
    object: string;
    title: string;
    message: string;
    raw: string;
    noColor: boolean;
    constructor(title: string, message: string);
}
