import { EventEmitter } from '@angular/core';
import { CryptoService } from '../../abstractions/crypto.service';
import { ExportService } from '../../abstractions/export.service';
import { I18nService } from '../../abstractions/i18n.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
export declare class ExportComponent {
    protected cryptoService: CryptoService;
    protected i18nService: I18nService;
    protected platformUtilsService: PlatformUtilsService;
    protected exportService: ExportService;
    protected win: Window;
    onSaved: EventEmitter<{}>;
    formPromise: Promise<string>;
    masterPassword: string;
    format: 'json' | 'csv';
    showPassword: boolean;
    constructor(cryptoService: CryptoService, i18nService: I18nService, platformUtilsService: PlatformUtilsService, exportService: ExportService, win: Window);
    submit(): Promise<void>;
    togglePassword(): void;
    protected saved(): void;
    protected getExportData(): Promise<string>;
    protected getFileName(prefix?: string): string;
    private downloadFile;
}
