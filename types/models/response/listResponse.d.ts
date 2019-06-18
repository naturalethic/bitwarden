import { BaseResponse } from './baseResponse';
export declare class ListResponse<T> extends BaseResponse {
    data: T[];
    continuationToken: string;
    constructor(response: any, t: new (dataResponse: any) => T);
}
