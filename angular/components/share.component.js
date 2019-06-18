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
const organizationUserStatusType_1 = require("../../enums/organizationUserStatusType");
const utils_1 = require("../../misc/utils");
class ShareComponent {
    constructor(collectionService, platformUtilsService, i18nService, userService, cipherService) {
        this.collectionService = collectionService;
        this.platformUtilsService = platformUtilsService;
        this.i18nService = i18nService;
        this.userService = userService;
        this.cipherService = cipherService;
        this.onSharedCipher = new core_1.EventEmitter();
        this.collections = [];
        this.organizations = [];
        this.writeableCollections = [];
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.load();
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const allCollections = yield this.collectionService.getAllDecrypted();
            this.writeableCollections = allCollections.map((c) => c).filter((c) => !c.readOnly);
            const orgs = yield this.userService.getAllOrganizations();
            this.organizations = orgs.sort(utils_1.Utils.getSortFunction(this.i18nService, 'name'))
                .filter((o) => o.enabled && o.status === organizationUserStatusType_1.OrganizationUserStatusType.Confirmed);
            const cipherDomain = yield this.cipherService.get(this.cipherId);
            this.cipher = yield cipherDomain.decrypt();
            if (this.organizationId == null && this.organizations.length > 0) {
                this.organizationId = this.organizations[0].id;
            }
            this.filterCollections();
        });
    }
    filterCollections() {
        this.writeableCollections.forEach((c) => c.checked = false);
        if (this.organizationId == null || this.writeableCollections.length === 0) {
            this.collections = [];
        }
        else {
            this.collections = this.writeableCollections.filter((c) => c.organizationId === this.organizationId);
        }
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            const cipherDomain = yield this.cipherService.get(this.cipherId);
            const cipherView = yield cipherDomain.decrypt();
            const checkedCollectionIds = this.collections.filter((c) => c.checked).map((c) => c.id);
            try {
                this.formPromise = this.cipherService.shareWithServer(cipherView, this.organizationId, checkedCollectionIds).then(() => __awaiter(this, void 0, void 0, function* () {
                    this.onSharedCipher.emit();
                    this.platformUtilsService.eventTrack('Shared Cipher');
                    this.platformUtilsService.showToast('success', null, this.i18nService.t('sharedItem'));
                }));
                yield this.formPromise;
                return true;
            }
            catch (_a) { }
            return false;
        });
    }
    get canSave() {
        if (this.collections != null) {
            for (let i = 0; i < this.collections.length; i++) {
                if (this.collections[i].checked) {
                    return true;
                }
            }
        }
        return false;
    }
}
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ShareComponent.prototype, "cipherId", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ShareComponent.prototype, "organizationId", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ShareComponent.prototype, "onSharedCipher", void 0);
exports.ShareComponent = ShareComponent;
//# sourceMappingURL=share.component.js.map