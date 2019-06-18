import { BreachAccountResponse } from '../models/response/breachAccountResponse';
export declare abstract class AuditService {
    passwordLeaked: (password: string) => Promise<number>;
    breachedAccounts: (username: string) => Promise<BreachAccountResponse[]>;
}
