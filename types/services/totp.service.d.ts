import { CryptoFunctionService } from '../abstractions/cryptoFunction.service';
import { StorageService } from '../abstractions/storage.service';
import { TotpService as TotpServiceAbstraction } from '../abstractions/totp.service';
export declare class TotpService implements TotpServiceAbstraction {
    private storageService;
    private cryptoFunctionService;
    constructor(storageService: StorageService, cryptoFunctionService: CryptoFunctionService);
    getCode(key: string): Promise<string>;
    getTimeInterval(key: string): number;
    isAutoCopyEnabled(): Promise<boolean>;
    private leftPad;
    private decToHex;
    private b32ToHex;
    private b32ToBytes;
    private sign;
}
