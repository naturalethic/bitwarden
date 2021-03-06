import { Router } from '@angular/router';
import { ApiService } from '../../abstractions/api.service';
import { AuthService } from '../../abstractions/auth.service';
import { CryptoService } from '../../abstractions/crypto.service';
import { I18nService } from '../../abstractions/i18n.service';
import { PasswordGenerationService } from '../../abstractions/passwordGeneration.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
import { StateService } from '../../abstractions/state.service';
export declare class RegisterComponent {
    protected authService: AuthService;
    protected router: Router;
    protected i18nService: I18nService;
    protected cryptoService: CryptoService;
    protected apiService: ApiService;
    protected stateService: StateService;
    protected platformUtilsService: PlatformUtilsService;
    protected passwordGenerationService: PasswordGenerationService;
    name: string;
    email: string;
    masterPassword: string;
    confirmMasterPassword: string;
    hint: string;
    showPassword: boolean;
    formPromise: Promise<any>;
    masterPasswordScore: number;
    protected successRoute: string;
    private masterPasswordStrengthTimeout;
    constructor(authService: AuthService, router: Router, i18nService: I18nService, cryptoService: CryptoService, apiService: ApiService, stateService: StateService, platformUtilsService: PlatformUtilsService, passwordGenerationService: PasswordGenerationService);
    readonly masterPasswordScoreWidth: number;
    readonly masterPasswordScoreColor: "success" | "warning" | "danger" | "primary";
    readonly masterPasswordScoreText: string;
    submit(): Promise<void>;
    togglePassword(confirmField: boolean): void;
    updatePasswordStrength(): void;
    private getPasswordStrengthUserInput;
}
