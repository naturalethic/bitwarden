"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let InputVerbatimDirective = class InputVerbatimDirective {
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
    }
    set appInputVerbatim(condition) {
        this.disableComplete = condition === '' || condition === true;
    }
    ngOnInit() {
        if (this.disableComplete && !this.el.nativeElement.hasAttribute('autocomplete')) {
            this.renderer.setAttribute(this.el.nativeElement, 'autocomplete', 'off');
        }
        if (!this.el.nativeElement.hasAttribute('autocapitalize')) {
            this.renderer.setAttribute(this.el.nativeElement, 'autocapitalize', 'none');
        }
        if (!this.el.nativeElement.hasAttribute('autocorrect')) {
            this.renderer.setAttribute(this.el.nativeElement, 'autocorrect', 'none');
        }
        if (!this.el.nativeElement.hasAttribute('spellcheck')) {
            this.renderer.setAttribute(this.el.nativeElement, 'spellcheck', 'false');
        }
        if (!this.el.nativeElement.hasAttribute('inputmode')) {
            this.renderer.setAttribute(this.el.nativeElement, 'inputmode', 'verbatim');
        }
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], InputVerbatimDirective.prototype, "appInputVerbatim", null);
InputVerbatimDirective = __decorate([
    core_1.Directive({
        selector: '[appInputVerbatim]',
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer2])
], InputVerbatimDirective);
exports.InputVerbatimDirective = InputVerbatimDirective;
//# sourceMappingURL=input-verbatim.directive.js.map