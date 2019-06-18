import { BaseResponse } from './baseResponse';
export declare class StringResponse implements BaseResponse {
    object: string;
    data: string;
    constructor(data: string);
}
