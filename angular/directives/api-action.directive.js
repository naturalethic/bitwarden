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
const validation_service_1 = require("../services/validation.service");
let ApiActionDirective = class ApiActionDirective {
    constructor(el, validationService) {
        this.el = el;
        this.validationService = validationService;
    }
    ngOnChanges(changes) {
        if (this.appApiAction == null || this.appApiAction.then == null) {
            return;
        }
        this.el.nativeElement.loading = true;
        this.appApiAction.then((response) => {
            this.el.nativeElement.loading = false;
        }, (e) => {
            this.el.nativeElement.loading = false;
            this.validationService.showError(e);
        });
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Promise)
], ApiActionDirective.prototype, "appApiAction", void 0);
ApiActionDirective = __decorate([
    core_1.Directive({
        selector: '[appApiAction]',
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, validation_service_1.ValidationService])
], ApiActionDirective);
exports.ApiActionDirective = ApiActionDirective;
//# sourceMappingURL=api-action.directive.js.map