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
let FallbackSrcDirective = class FallbackSrcDirective {
    constructor(el) {
        this.el = el;
    }
    onError() {
        this.el.nativeElement.src = this.appFallbackSrc;
    }
};
__decorate([
    core_1.Input('appFallbackSrc'),
    __metadata("design:type", String)
], FallbackSrcDirective.prototype, "appFallbackSrc", void 0);
__decorate([
    core_1.HostListener('error'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FallbackSrcDirective.prototype, "onError", null);
FallbackSrcDirective = __decorate([
    core_1.Directive({
        selector: '[appFallbackSrc]',
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], FallbackSrcDirective);
exports.FallbackSrcDirective = FallbackSrcDirective;
//# sourceMappingURL=fallback-src.directive.js.map