import { BaseResponse } from '../response/baseResponse';
import { UriMatchType } from '../../enums/uriMatchType';
export declare class LoginUriApi extends BaseResponse {
    uri: string;
    match: UriMatchType;
    constructor(data?: any);
}
