import { ElementRef } from '@angular/core';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
export declare class SelectCopyDirective {
    private el;
    private platformUtilsService;
    constructor(el: ElementRef, platformUtilsService: PlatformUtilsService);
    onCopy(): void;
}
