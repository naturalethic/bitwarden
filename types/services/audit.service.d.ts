import { ApiService } from '../abstractions/api.service';
import { AuditService as AuditServiceAbstraction } from '../abstractions/audit.service';
import { CryptoFunctionService } from '../abstractions/cryptoFunction.service';
import { BreachAccountResponse } from '../models/response/breachAccountResponse';
export declare class AuditService implements AuditServiceAbstraction {
    private cryptoFunctionService;
    private apiService;
    constructor(cryptoFunctionService: CryptoFunctionService, apiService: ApiService);
    passwordLeaked(password: string): Promise<number>;
    breachedAccounts(username: string): Promise<BreachAccountResponse[]>;
}
