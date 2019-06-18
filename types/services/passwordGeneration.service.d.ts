import * as zxcvbn from 'zxcvbn';
import { GeneratedPasswordHistory } from '../models/domain/generatedPasswordHistory';
import { CryptoService } from '../abstractions/crypto.service';
import { PasswordGenerationService as PasswordGenerationServiceAbstraction } from '../abstractions/passwordGeneration.service';
import { StorageService } from '../abstractions/storage.service';
export declare class PasswordGenerationService implements PasswordGenerationServiceAbstraction {
    private cryptoService;
    private storageService;
    private optionsCache;
    private history;
    constructor(cryptoService: CryptoService, storageService: StorageService);
    generatePassword(options: any): Promise<string>;
    generatePassphrase(options: any): Promise<string>;
    getOptions(): Promise<any>;
    saveOptions(options: any): Promise<void>;
    getHistory(): Promise<GeneratedPasswordHistory[]>;
    addHistory(password: string): Promise<any>;
    clear(): Promise<any>;
    passwordStrength(password: string, userInputs?: string[]): zxcvbn.ZXCVBNResult;
    private capitalize;
    private appendRandomNumberToRandomWord;
    private encryptHistory;
    private decryptHistory;
    private matchesPrevious;
    private shuffleArray;
}
