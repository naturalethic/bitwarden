import { ElementRef } from '@angular/core';
export declare class AutofocusDirective {
    private el;
    appAutofocus: boolean | string;
    private autofocus;
    constructor(el: ElementRef);
    ngOnInit(): void;
}
