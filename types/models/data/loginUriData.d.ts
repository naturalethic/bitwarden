import { UriMatchType } from '../../enums/uriMatchType';
import { LoginUriApi } from '../api/loginUriApi';
export declare class LoginUriData {
    uri: string;
    match: UriMatchType;
    constructor(data?: LoginUriApi);
}
