import { EventEmitter, OnInit } from '@angular/core';
import { I18nService } from '../../abstractions/i18n.service';
import { PasswordGenerationService } from '../../abstractions/passwordGeneration.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
export declare class PasswordGeneratorComponent implements OnInit {
    protected passwordGenerationService: PasswordGenerationService;
    protected platformUtilsService: PlatformUtilsService;
    protected i18nService: I18nService;
    private win;
    showSelect: boolean;
    onSelected: EventEmitter<string>;
    options: any;
    password: string;
    showOptions: boolean;
    avoidAmbiguous: boolean;
    constructor(passwordGenerationService: PasswordGenerationService, platformUtilsService: PlatformUtilsService, i18nService: I18nService, win: Window);
    ngOnInit(): Promise<void>;
    sliderChanged(): Promise<void>;
    sliderInput(): Promise<void>;
    saveOptions(regenerate?: boolean): Promise<void>;
    regenerate(): Promise<void>;
    copy(): void;
    select(): void;
    toggleOptions(): void;
    private normalizeOptions;
}
