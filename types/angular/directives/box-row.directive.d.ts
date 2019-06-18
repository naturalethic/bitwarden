import { ElementRef, OnInit } from '@angular/core';
export declare class BoxRowDirective implements OnInit {
    private elRef;
    el: HTMLElement;
    formEls: Element[];
    constructor(elRef: ElementRef);
    ngOnInit(): void;
    onClick(event: Event): void;
}
