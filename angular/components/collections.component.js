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
class CollectionsComponent {
    constructor(collectionService, platformUtilsService, i18nService, cipherService) {
        this.collectionService = collectionService;
        this.platformUtilsService = platformUtilsService;
        this.i18nService = i18nService;
        this.cipherService = cipherService;
        this.onSavedCollections = new core_1.EventEmitter();
        this.collections = [];
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.load();
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cipherDomain = yield this.loadCipher();
            this.collectionIds = this.loadCipherCollections();
            this.cipher = yield this.cipherDomain.decrypt();
            this.collections = yield this.loadCollections();
            this.collections.forEach((c) => c.checked = false);
            if (this.collectionIds != null) {
                this.collections.forEach((c) => {
                    c.checked = this.collectionIds != null && this.collectionIds.indexOf(c.id) > -1;
                });
            }
        });
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cipherDomain.collectionIds = this.collections
                .filter((c) => !!c.checked)
                .map((c) => c.id);
            try {
                this.formPromise = this.saveCollections();
                yield this.formPromise;
                this.onSavedCollections.emit();
                this.platformUtilsService.eventTrack('Edited Cipher Collections');
                this.platformUtilsService.showToast('success', null, this.i18nService.t('editedItem'));
            }
            catch (_a) { }
        });
    }
    loadCipher() {
        return this.cipherService.get(this.cipherId);
    }
    loadCipherCollections() {
        return this.cipherDomain.collectionIds;
    }
    loadCollections() {
        return __awaiter(this, void 0, void 0, function* () {
            const allCollections = yield this.collectionService.getAllDecrypted();
            return allCollections.filter((c) => !c.readOnly && c.organizationId === this.cipher.organizationId);
        });
    }
    saveCollections() {
        return this.cipherService.saveCollectionsWithServer(this.cipherDomain);
    }
}
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], CollectionsComponent.prototype, "cipherId", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], CollectionsComponent.prototype, "onSavedCollections", void 0);
exports.CollectionsComponent = CollectionsComponent;
//# sourceMappingURL=collections.component.js.map