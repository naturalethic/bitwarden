import { OnInit } from '@angular/core';
import { I18nService } from '../../abstractions/i18n.service';
import { PasswordGenerationService } from '../../abstractions/passwordGeneration.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
import { GeneratedPasswordHistory } from '../../models/domain/generatedPasswordHistory';
export declare class PasswordGeneratorHistoryComponent implements OnInit {
    protected passwordGenerationService: PasswordGenerationService;
    protected platformUtilsService: PlatformUtilsService;
    protected i18nService: I18nService;
    private win;
    history: GeneratedPasswordHistory[];
    constructor(passwordGenerationService: PasswordGenerationService, platformUtilsService: PlatformUtilsService, i18nService: I18nService, win: Window);
    ngOnInit(): Promise<void>;
    clear(): void;
    copy(password: string): void;
}
