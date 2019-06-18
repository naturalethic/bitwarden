import { UriMatchType } from '../../enums/uriMatchType';
import { LoginUriView } from '../view/loginUriView';
export declare class LoginUri {
    static template(): LoginUri;
    static toView(req: LoginUri, view?: LoginUriView): LoginUriView;
    uri: string;
    match: UriMatchType;
    constructor(o?: LoginUriView);
}
