"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
/**
 * A pipe that sanitizes HTML and highlights numbers and special characters (in different colors each).
 */
let ColorPasswordPipe = class ColorPasswordPipe {
    transform(password) {
        let colorizedPassword = '';
        for (let i = 0; i < password.length; i++) {
            let character = password[i];
            let isSpecial = false;
            // Sanitize HTML first.
            switch (character) {
                case '&':
                    character = '&amp;';
                    isSpecial = true;
                    break;
                case '<':
                    character = '&lt;';
                    isSpecial = true;
                    break;
                case '>':
                    character = '&gt;';
                    isSpecial = true;
                    break;
                case ' ':
                    character = '&nbsp;';
                    isSpecial = true;
                    break;
                default:
                    break;
            }
            let type = 'letter';
            if (isSpecial || character.match(/[^\w ]/)) {
                type = 'special';
            }
            else if (character.match(/\d/)) {
                type = 'number';
            }
            colorizedPassword += '<span class="password-' + type + '">' + character + '</span>';
        }
        return colorizedPassword;
    }
};
ColorPasswordPipe = __decorate([
    core_1.Pipe({ name: 'colorPassword' })
], ColorPasswordPipe);
exports.ColorPasswordPipe = ColorPasswordPipe;
//# sourceMappingURL=color-password.pipe.js.map