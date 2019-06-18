import { LoginUri } from './loginUri';
import { LoginView } from '../view/loginView';
export declare class Login {
    static template(): Login;
    static toView(req: Login, view?: LoginView): LoginView;
    uris: LoginUri[];
    username: string;
    password: string;
    totp: string;
    constructor(o?: LoginView);
}
