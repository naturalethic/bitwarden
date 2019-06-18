import { PipeTransform } from '@angular/core';
import { I18nService } from '../../abstractions/i18n.service';
export declare class I18nPipe implements PipeTransform {
    private i18nService;
    constructor(i18nService: I18nService);
    transform(id: string, p1?: string, p2?: string, p3?: string): string;
}
