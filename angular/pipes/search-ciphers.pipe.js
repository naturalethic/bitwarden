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
const enums_1 = require("../../enums");
let SearchCiphersPipe = class SearchCiphersPipe {
    constructor(platformUtilsService) {
        this.onlySearchName = false;
        this.onlySearchName = platformUtilsService.getDevice() === enums_1.DeviceType.EdgeExtension;
    }
    transform(ciphers, searchText) {
        if (ciphers == null || ciphers.length === 0) {
            return [];
        }
        if (searchText == null || searchText.length < 2) {
            return ciphers;
        }
        searchText = searchText.trim().toLowerCase();
        return ciphers.filter((c) => {
            if (c.name != null && c.name.toLowerCase().indexOf(searchText) > -1) {
                return true;
            }
            if (this.onlySearchName) {
                return false;
            }
            if (searchText.length >= 8 && c.id.startsWith(searchText)) {
                return true;
            }
            if (c.subTitle != null && c.subTitle.toLowerCase().indexOf(searchText) > -1) {
                return true;
            }
            if (c.login && c.login.uri != null && c.login.uri.toLowerCase().indexOf(searchText) > -1) {
                return true;
            }
            return false;
        });
    }
};
SearchCiphersPipe = __decorate([
    core_1.Pipe({
        name: 'searchCiphers',
    }),
    __metadata("design:paramtypes", [platformUtils_service_1.PlatformUtilsService])
], SearchCiphersPipe);
exports.SearchCiphersPipe = SearchCiphersPipe;
//# sourceMappingURL=search-ciphers.pipe.js.map