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
let A11yTitleDirective = class A11yTitleDirective {
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
    }
    set appA11yTitle(title) {
        this.title = title;
    }
    ngOnInit() {
        if (!this.el.nativeElement.hasAttribute('title')) {
            this.renderer.setAttribute(this.el.nativeElement, 'title', this.title);
        }
        if (!this.el.nativeElement.hasAttribute('aria-label')) {
            this.renderer.setAttribute(this.el.nativeElement, 'aria-label', this.title);
        }
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], A11yTitleDirective.prototype, "appA11yTitle", null);
A11yTitleDirective = __decorate([
    core_1.Directive({
        selector: '[appA11yTitle]',
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer2])
], A11yTitleDirective);
exports.A11yTitleDirective = A11yTitleDirective;
//# sourceMappingURL=a11y-title.directive.js.map