import { ElementRef, OnChanges } from '@angular/core';
import { ValidationService } from '../services/validation.service';
export declare class ApiActionDirective implements OnChanges {
    private el;
    private validationService;
    appApiAction: Promise<any>;
    constructor(el: ElementRef, validationService: ValidationService);
    ngOnChanges(changes: any): void;
}
