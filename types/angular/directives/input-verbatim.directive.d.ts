import { ElementRef, Renderer2 } from '@angular/core';
export declare class InputVerbatimDirective {
    private el;
    private renderer;
    appInputVerbatim: boolean | string;
    private disableComplete;
    constructor(el: ElementRef, renderer: Renderer2);
    ngOnInit(): void;
}
