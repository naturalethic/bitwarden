import { ElementRef } from '@angular/core';
export declare class FallbackSrcDirective {
    private el;
    appFallbackSrc: string;
    constructor(el: ElementRef);
    onError(): void;
}
