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
const cipherType_1 = require("../../enums/cipherType");
const cipherView_1 = require("../../models/view/cipherView");
const environment_service_1 = require("../../abstractions/environment.service");
const state_service_1 = require("../../abstractions/state.service");
const constants_service_1 = require("../../services/constants.service");
const utils_1 = require("../../misc/utils");
const IconMap = {
    'fa-globe': String.fromCharCode(0xf0ac),
    'fa-sticky-note-o': String.fromCharCode(0xf24a),
    'fa-id-card-o': String.fromCharCode(0xf2c3),
    'fa-credit-card': String.fromCharCode(0xf09d),
    'fa-android': String.fromCharCode(0xf17b),
    'fa-apple': String.fromCharCode(0xf179),
};
let IconComponent = class IconComponent {
    constructor(environmentService, stateService) {
        this.stateService = stateService;
        this.iconsUrl = environmentService.iconsUrl;
        if (!this.iconsUrl) {
            if (environmentService.baseUrl) {
                this.iconsUrl = environmentService.baseUrl + '/icons';
            }
            else {
                this.iconsUrl = 'https://icons.bitwarden.net';
            }
        }
    }
    ngOnChanges() {
        return __awaiter(this, void 0, void 0, function* () {
            this.imageEnabled = !(yield this.stateService.get(constants_service_1.ConstantsService.disableFaviconKey));
            this.load();
        });
    }
    get iconCode() {
        return IconMap[this.icon];
    }
    load() {
        switch (this.cipher.type) {
            case cipherType_1.CipherType.Login:
                this.icon = 'fa-globe';
                this.setLoginIcon();
                break;
            case cipherType_1.CipherType.SecureNote:
                this.icon = 'fa-sticky-note-o';
                break;
            case cipherType_1.CipherType.Card:
                this.icon = 'fa-credit-card';
                break;
            case cipherType_1.CipherType.Identity:
                this.icon = 'fa-id-card-o';
                break;
            default:
                break;
        }
    }
    setLoginIcon() {
        if (this.cipher.login.uri) {
            let hostnameUri = this.cipher.login.uri;
            let isWebsite = false;
            if (hostnameUri.indexOf('androidapp://') === 0) {
                this.icon = 'fa-android';
                this.image = null;
            }
            else if (hostnameUri.indexOf('iosapp://') === 0) {
                this.icon = 'fa-apple';
                this.image = null;
            }
            else if (this.imageEnabled && hostnameUri.indexOf('://') === -1 && hostnameUri.indexOf('.') > -1) {
                hostnameUri = 'http://' + hostnameUri;
                isWebsite = true;
            }
            else if (this.imageEnabled) {
                isWebsite = hostnameUri.indexOf('http') === 0 && hostnameUri.indexOf('.') > -1;
            }
            if (this.imageEnabled && isWebsite) {
                try {
                    this.image = this.iconsUrl + '/' + utils_1.Utils.getHostname(hostnameUri) + '/icon.png';
                    this.fallbackImage = 'images/fa-globe.png';
                }
                catch (e) { }
            }
        }
        else {
            this.image = null;
        }
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", cipherView_1.CipherView)
], IconComponent.prototype, "cipher", void 0);
IconComponent = __decorate([
    core_1.Component({
        selector: 'app-vault-icon',
        templateUrl: 'icon.component.html',
    }),
    __metadata("design:paramtypes", [environment_service_1.EnvironmentService, state_service_1.StateService])
], IconComponent);
exports.IconComponent = IconComponent;
//# sourceMappingURL=icon.component.js.map