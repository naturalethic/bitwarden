import { UriMatchType } from '../../enums/uriMatchType';
import { View } from './view';
import { LoginUri } from '../domain/loginUri';
export declare class LoginUriView implements View {
    match: UriMatchType;
    private _uri;
    private _domain;
    private _hostname;
    private _canLaunch;
    constructor(u?: LoginUri);
    uri: string;
    readonly domain: string;
    readonly hostname: string;
    readonly hostnameOrUri: string;
    readonly isWebsite: boolean;
    readonly canLaunch: boolean;
    readonly launchUri: string;
}
