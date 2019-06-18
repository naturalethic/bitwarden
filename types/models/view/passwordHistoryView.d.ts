import { View } from './view';
import { Password } from '../domain/password';
export declare class PasswordHistoryView implements View {
    password: string;
    lastUsedDate: Date;
    constructor(ph?: Password);
}
