import { BaseResponse } from './baseResponse';
export declare class SelectionReadOnlyResponse extends BaseResponse {
    id: string;
    readOnly: boolean;
    constructor(response: any);
}
