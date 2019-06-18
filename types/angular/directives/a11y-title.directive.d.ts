import { ElementRef, Renderer2 } from '@angular/core';
export declare class A11yTitleDirective {
    private el;
    private renderer;
    appA11yTitle: string;
    private title;
    constructor(el: ElementRef, renderer: Renderer2);
    ngOnInit(): void;
}
