import { PasswordHistoryResponse } from '../response/passwordHistoryResponse';
export declare class PasswordHistoryData {
    password: string;
    lastUsedDate: string;
    constructor(response?: PasswordHistoryResponse);
}
