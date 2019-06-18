import { BaseResponse } from './baseResponse';
export declare class ListResponse implements BaseResponse {
    object: string;
    data: BaseResponse[];
    constructor(data: BaseResponse[]);
}
