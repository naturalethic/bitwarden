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
let BoxRowDirective = class BoxRowDirective {
    constructor(elRef) {
        this.elRef = elRef;
        this.el = null;
        this.el = elRef.nativeElement;
    }
    ngOnInit() {
        this.formEls = Array.from(this.el.querySelectorAll('input:not([type="hidden"]), select, textarea'));
        this.formEls.forEach((formEl) => {
            formEl.addEventListener('focus', (event) => {
                this.el.classList.add('active');
            }, false);
            formEl.addEventListener('blur', (event) => {
                this.el.classList.remove('active');
            }, false);
        });
    }
    onClick(event) {
        const target = event.target;
        if (target !== this.el && !target.classList.contains('progress') &&
            !target.classList.contains('progress-bar')) {
            return;
        }
        if (this.formEls.length > 0) {
            const formEl = this.formEls[0];
            if (formEl.tagName.toLowerCase() === 'input') {
                const inputEl = formEl;
                if (inputEl.type != null && inputEl.type.toLowerCase() === 'checkbox') {
                    inputEl.click();
                    return;
                }
            }
            formEl.focus();
        }
    }
};
__decorate([
    core_1.HostListener('click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], BoxRowDirective.prototype, "onClick", null);
BoxRowDirective = __decorate([
    core_1.Directive({
        selector: '[appBoxRow]',
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], BoxRowDirective);
exports.BoxRowDirective = BoxRowDirective;
//# sourceMappingURL=box-row.directive.js.map