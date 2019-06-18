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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
class PasswordGeneratorComponent {
    constructor(passwordGenerationService, platformUtilsService, i18nService, win) {
        this.passwordGenerationService = passwordGenerationService;
        this.platformUtilsService = platformUtilsService;
        this.i18nService = i18nService;
        this.win = win;
        this.showSelect = false;
        this.onSelected = new core_1.EventEmitter();
        this.options = {};
        this.password = '-';
        this.showOptions = false;
        this.avoidAmbiguous = false;
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.options = yield this.passwordGenerationService.getOptions();
            this.avoidAmbiguous = !this.options.ambiguous;
            this.options.type = this.options.type === 'passphrase' ? 'passphrase' : 'password';
            this.password = yield this.passwordGenerationService.generatePassword(this.options);
            this.platformUtilsService.eventTrack('Generated Password');
            yield this.passwordGenerationService.addHistory(this.password);
        });
    }
    sliderChanged() {
        return __awaiter(this, void 0, void 0, function* () {
            this.saveOptions(false);
            yield this.passwordGenerationService.addHistory(this.password);
            this.platformUtilsService.eventTrack('Regenerated Password');
        });
    }
    sliderInput() {
        return __awaiter(this, void 0, void 0, function* () {
            this.normalizeOptions();
            this.password = yield this.passwordGenerationService.generatePassword(this.options);
        });
    }
    saveOptions(regenerate = true) {
        return __awaiter(this, void 0, void 0, function* () {
            this.normalizeOptions();
            yield this.passwordGenerationService.saveOptions(this.options);
            if (regenerate) {
                yield this.regenerate();
            }
        });
    }
    regenerate() {
        return __awaiter(this, void 0, void 0, function* () {
            this.password = yield this.passwordGenerationService.generatePassword(this.options);
            yield this.passwordGenerationService.addHistory(this.password);
            this.platformUtilsService.eventTrack('Regenerated Password');
        });
    }
    copy() {
        this.platformUtilsService.eventTrack('Copied Generated Password');
        const copyOptions = this.win != null ? { window: this.win } : null;
        this.platformUtilsService.copyToClipboard(this.password, copyOptions);
        this.platformUtilsService.showToast('info', null, this.i18nService.t('valueCopied', this.i18nService.t('password')));
    }
    select() {
        this.platformUtilsService.eventTrack('Selected Generated Password');
        this.onSelected.emit(this.password);
    }
    toggleOptions() {
        this.showOptions = !this.showOptions;
    }
    normalizeOptions() {
        this.options.minLowercase = 0;
        this.options.minUppercase = 0;
        this.options.ambiguous = !this.avoidAmbiguous;
        if (!this.options.uppercase && !this.options.lowercase && !this.options.number && !this.options.special) {
            this.options.lowercase = true;
            if (this.win != null) {
                const lowercase = this.win.document.querySelector('#lowercase');
                if (lowercase) {
                    lowercase.checked = true;
                }
            }
        }
        if (!this.options.length || this.options.length < 5) {
            this.options.length = 5;
        }
        else if (this.options.length > 128) {
            this.options.length = 128;
        }
        if (!this.options.minNumber) {
            this.options.minNumber = 0;
        }
        else if (this.options.minNumber > this.options.length) {
            this.options.minNumber = this.options.length;
        }
        else if (this.options.minNumber > 9) {
            this.options.minNumber = 9;
        }
        if (!this.options.minSpecial) {
            this.options.minSpecial = 0;
        }
        else if (this.options.minSpecial > this.options.length) {
            this.options.minSpecial = this.options.length;
        }
        else if (this.options.minSpecial > 9) {
            this.options.minSpecial = 9;
        }
        if (this.options.minSpecial + this.options.minNumber > this.options.length) {
            this.options.minSpecial = this.options.length - this.options.minNumber;
        }
        if (this.options.numWords == null || this.options.length < 3) {
            this.options.numWords = 3;
        }
        else if (this.options.numWords > 20) {
            this.options.numWords = 20;
        }
        if (this.options.wordSeparator != null && this.options.wordSeparator.length > 1) {
            this.options.wordSeparator = this.options.wordSeparator[0];
        }
    }
}
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], PasswordGeneratorComponent.prototype, "showSelect", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], PasswordGeneratorComponent.prototype, "onSelected", void 0);
exports.PasswordGeneratorComponent = PasswordGeneratorComponent;
//# sourceMappingURL=password-generator.component.js.map