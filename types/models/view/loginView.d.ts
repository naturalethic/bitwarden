import { LoginUriView } from './loginUriView';
import { View } from './view';
import { Login } from '../domain/login';
export declare class LoginView implements View {
    username: string;
    password: string;
    passwordRevisionDate?: Date;
    totp: string;
    uris: LoginUriView[];
    constructor(l?: Login);
    readonly uri: string;
    readonly maskedPassword: string;
    readonly subTitle: string;
    readonly canLaunch: boolean;
    readonly launchUri: string;
    readonly hasUris: boolean;
}
