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
const platformUtils_service_1 = require("../../abstractions/platformUtils.service");
let SelectCopyDirective = class SelectCopyDirective {
    constructor(el, platformUtilsService) {
        this.el = el;
        this.platformUtilsService = platformUtilsService;
    }
    onCopy() {
        if (window == null) {
            return;
        }
        let copyText = '';
        const selection = window.getSelection();
        for (let i = 0; i < selection.rangeCount; i++) {
            const range = selection.getRangeAt(i);
            const text = range.toString();
            // The selection should only contain one line of text. In some cases however, the
            // selection contains newlines and space characters from the indentation of following
            // sibling nodes. To avoid copying passwords containing trailing newlines and spaces
            // that aren't part of the password, the selection has to be trimmed.
            let stringEndPos = text.length;
            const newLinePos = text.search(/(?:\r\n|\r|\n)/);
            if (newLinePos > -1) {
                const otherPart = text.substr(newLinePos).trim();
                if (otherPart === '') {
                    stringEndPos = newLinePos;
                }
            }
            copyText += text.substring(0, stringEndPos);
        }
        this.platformUtilsService.copyToClipboard(copyText, { window: window });
    }
};
__decorate([
    core_1.HostListener('copy'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SelectCopyDirective.prototype, "onCopy", null);
SelectCopyDirective = __decorate([
    core_1.Directive({
        selector: '[appSelectCopy]',
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, platformUtils_service_1.PlatformUtilsService])
], SelectCopyDirective);
exports.SelectCopyDirective = SelectCopyDirective;
//# sourceMappingURL=select-copy.directive.js.map