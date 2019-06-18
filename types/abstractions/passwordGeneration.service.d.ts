/// <reference types="zxcvbn" />
import { GeneratedPasswordHistory } from '../models/domain/generatedPasswordHistory';
export declare abstract class PasswordGenerationService {
    generatePassword: (options: any) => Promise<string>;
    generatePassphrase: (options: any) => Promise<string>;
    getOptions: () => any;
    saveOptions: (options: any) => Promise<any>;
    getHistory: () => Promise<GeneratedPasswordHistory[]>;
    addHistory: (password: string) => Promise<any>;
    clear: () => Promise<any>;
    passwordStrength: (password: string, userInputs?: string[]) => zxcvbn.ZXCVBNResult;
}
