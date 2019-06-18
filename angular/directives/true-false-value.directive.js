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
var TrueFalseValueDirective_1;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
// ref: https://juristr.com/blog/2018/02/ng-true-value-directive/
let TrueFalseValueDirective = TrueFalseValueDirective_1 = class TrueFalseValueDirective {
    constructor(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.trueValue = true;
        this.falseValue = false;
        this.propagateChange = (_) => { };
    }
    onHostChange(ev) {
        this.propagateChange(ev.target.checked ? this.trueValue : this.falseValue);
    }
    writeValue(obj) {
        if (obj === this.trueValue) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'checked', true);
        }
        else {
            this.renderer.setProperty(this.elementRef.nativeElement, 'checked', false);
        }
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) { }
    setDisabledState(isDisabled) { }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TrueFalseValueDirective.prototype, "trueValue", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TrueFalseValueDirective.prototype, "falseValue", void 0);
__decorate([
    core_1.HostListener('change', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrueFalseValueDirective.prototype, "onHostChange", null);
TrueFalseValueDirective = TrueFalseValueDirective_1 = __decorate([
    core_1.Directive({
        selector: 'input[type=checkbox][appTrueFalseValue]',
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useExisting: core_1.forwardRef(() => TrueFalseValueDirective_1),
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer2])
], TrueFalseValueDirective);
exports.TrueFalseValueDirective = TrueFalseValueDirective;
//# sourceMappingURL=true-false-value.directive.js.map