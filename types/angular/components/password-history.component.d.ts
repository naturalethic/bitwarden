import { OnInit } from '@angular/core';
import { CipherService } from '../../abstractions/cipher.service';
import { I18nService } from '../../abstractions/i18n.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
import { PasswordHistoryView } from '../../models/view/passwordHistoryView';
export declare class PasswordHistoryComponent implements OnInit {
    protected cipherService: CipherService;
    protected platformUtilsService: PlatformUtilsService;
    protected i18nService: I18nService;
    private win;
    cipherId: string;
    history: PasswordHistoryView[];
    constructor(cipherService: CipherService, platformUtilsService: PlatformUtilsService, i18nService: I18nService, win: Window);
    ngOnInit(): Promise<void>;
    copy(password: string): void;
    protected init(): Promise<void>;
}
