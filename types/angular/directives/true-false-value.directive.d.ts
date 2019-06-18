import { ElementRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
export declare class TrueFalseValueDirective implements ControlValueAccessor {
    private elementRef;
    private renderer;
    trueValue: boolean;
    falseValue: boolean;
    constructor(elementRef: ElementRef, renderer: Renderer2);
    onHostChange(ev: any): void;
    writeValue(obj: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState?(isDisabled: boolean): void;
    private propagateChange;
}
