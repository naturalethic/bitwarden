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
const drag_drop_1 = require("@angular/cdk/drag-drop");
const core_1 = require("@angular/core");
const cipherType_1 = require("../../enums/cipherType");
const fieldType_1 = require("../../enums/fieldType");
const organizationUserStatusType_1 = require("../../enums/organizationUserStatusType");
const secureNoteType_1 = require("../../enums/secureNoteType");
const uriMatchType_1 = require("../../enums/uriMatchType");
const cardView_1 = require("../../models/view/cardView");
const cipherView_1 = require("../../models/view/cipherView");
const fieldView_1 = require("../../models/view/fieldView");
const identityView_1 = require("../../models/view/identityView");
const loginUriView_1 = require("../../models/view/loginUriView");
const loginView_1 = require("../../models/view/loginView");
const secureNoteView_1 = require("../../models/view/secureNoteView");
const utils_1 = require("../../misc/utils");
class AddEditComponent {
    constructor(cipherService, folderService, i18nService, platformUtilsService, auditService, stateService, userService, collectionService, messagingService) {
        this.cipherService = cipherService;
        this.folderService = folderService;
        this.i18nService = i18nService;
        this.platformUtilsService = platformUtilsService;
        this.auditService = auditService;
        this.stateService = stateService;
        this.userService = userService;
        this.collectionService = collectionService;
        this.messagingService = messagingService;
        this.folderId = null;
        this.organizationId = null;
        this.onSavedCipher = new core_1.EventEmitter();
        this.onDeletedCipher = new core_1.EventEmitter();
        this.onCancelled = new core_1.EventEmitter();
        this.onEditAttachments = new core_1.EventEmitter();
        this.onShareCipher = new core_1.EventEmitter();
        this.onEditCollections = new core_1.EventEmitter();
        this.onGeneratePassword = new core_1.EventEmitter();
        this.editMode = false;
        this.collections = [];
        this.showPassword = false;
        this.showCardCode = false;
        this.cipherType = cipherType_1.CipherType;
        this.fieldType = fieldType_1.FieldType;
        this.addFieldType = fieldType_1.FieldType.Text;
        this.ownershipOptions = [];
        this.typeOptions = [
            { name: i18nService.t('typeLogin'), value: cipherType_1.CipherType.Login },
            { name: i18nService.t('typeCard'), value: cipherType_1.CipherType.Card },
            { name: i18nService.t('typeIdentity'), value: cipherType_1.CipherType.Identity },
            { name: i18nService.t('typeSecureNote'), value: cipherType_1.CipherType.SecureNote },
        ];
        this.cardBrandOptions = [
            { name: '-- ' + i18nService.t('select') + ' --', value: null },
            { name: 'Visa', value: 'Visa' },
            { name: 'Mastercard', value: 'Mastercard' },
            { name: 'American Express', value: 'Amex' },
            { name: 'Discover', value: 'Discover' },
            { name: 'Diners Club', value: 'Diners Club' },
            { name: 'JCB', value: 'JCB' },
            { name: 'Maestro', value: 'Maestro' },
            { name: 'UnionPay', value: 'UnionPay' },
            { name: i18nService.t('other'), value: 'Other' },
        ];
        this.cardExpMonthOptions = [
            { name: '-- ' + i18nService.t('select') + ' --', value: null },
            { name: '01 - ' + i18nService.t('january'), value: '1' },
            { name: '02 - ' + i18nService.t('february'), value: '2' },
            { name: '03 - ' + i18nService.t('march'), value: '3' },
            { name: '04 - ' + i18nService.t('april'), value: '4' },
            { name: '05 - ' + i18nService.t('may'), value: '5' },
            { name: '06 - ' + i18nService.t('june'), value: '6' },
            { name: '07 - ' + i18nService.t('july'), value: '7' },
            { name: '08 - ' + i18nService.t('august'), value: '8' },
            { name: '09 - ' + i18nService.t('september'), value: '9' },
            { name: '10 - ' + i18nService.t('october'), value: '10' },
            { name: '11 - ' + i18nService.t('november'), value: '11' },
            { name: '12 - ' + i18nService.t('december'), value: '12' },
        ];
        this.identityTitleOptions = [
            { name: '-- ' + i18nService.t('select') + ' --', value: null },
            { name: i18nService.t('mr'), value: i18nService.t('mr') },
            { name: i18nService.t('mrs'), value: i18nService.t('mrs') },
            { name: i18nService.t('ms'), value: i18nService.t('ms') },
            { name: i18nService.t('dr'), value: i18nService.t('dr') },
        ];
        this.addFieldTypeOptions = [
            { name: i18nService.t('cfTypeText'), value: fieldType_1.FieldType.Text },
            { name: i18nService.t('cfTypeHidden'), value: fieldType_1.FieldType.Hidden },
            { name: i18nService.t('cfTypeBoolean'), value: fieldType_1.FieldType.Boolean },
        ];
        this.uriMatchOptions = [
            { name: i18nService.t('defaultMatchDetection'), value: null },
            { name: i18nService.t('baseDomain'), value: uriMatchType_1.UriMatchType.Domain },
            { name: i18nService.t('host'), value: uriMatchType_1.UriMatchType.Host },
            { name: i18nService.t('startsWith'), value: uriMatchType_1.UriMatchType.StartsWith },
            { name: i18nService.t('regEx'), value: uriMatchType_1.UriMatchType.RegularExpression },
            { name: i18nService.t('exact'), value: uriMatchType_1.UriMatchType.Exact },
            { name: i18nService.t('never'), value: uriMatchType_1.UriMatchType.Never },
        ];
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const myEmail = yield this.userService.getEmail();
            this.ownershipOptions.push({ name: myEmail, value: null });
            const orgs = yield this.userService.getAllOrganizations();
            orgs.sort(utils_1.Utils.getSortFunction(this.i18nService, 'name')).forEach((o) => {
                if (o.enabled && o.status === organizationUserStatusType_1.OrganizationUserStatusType.Confirmed) {
                    this.ownershipOptions.push({ name: o.name, value: o.id });
                }
            });
            this.writeableCollections = yield this.loadCollections();
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.editMode = this.cipherId != null;
            if (this.editMode) {
                this.editMode = true;
                this.title = this.i18nService.t('editItem');
            }
            else {
                this.title = this.i18nService.t('addItem');
            }
            this.cipher = yield this.stateService.get('addEditCipher');
            yield this.stateService.remove('addEditCipher');
            if (this.cipher == null) {
                if (this.editMode) {
                    const cipher = yield this.loadCipher();
                    this.cipher = yield cipher.decrypt();
                }
                else {
                    this.cipher = new cipherView_1.CipherView();
                    this.cipher.organizationId = this.organizationId == null ? null : this.organizationId;
                    this.cipher.folderId = this.folderId;
                    this.cipher.type = this.type == null ? cipherType_1.CipherType.Login : this.type;
                    this.cipher.login = new loginView_1.LoginView();
                    this.cipher.login.uris = [new loginUriView_1.LoginUriView()];
                    this.cipher.card = new cardView_1.CardView();
                    this.cipher.identity = new identityView_1.IdentityView();
                    this.cipher.secureNote = new secureNoteView_1.SecureNoteView();
                    this.cipher.secureNote.type = secureNoteType_1.SecureNoteType.Generic;
                    yield this.organizationChanged();
                    if (this.collectionIds != null && this.collectionIds.length > 0 && this.collections.length > 0) {
                        this.collections.forEach((c) => {
                            if (this.collectionIds.indexOf(c.id) > -1) {
                                c.checked = true;
                            }
                        });
                    }
                }
            }
            this.folders = yield this.folderService.getAllDecrypted();
        });
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cipher.name == null || this.cipher.name === '') {
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('nameRequired'));
                return false;
            }
            if (!this.editMode && this.cipher.type === cipherType_1.CipherType.Login &&
                this.cipher.login.uris != null && this.cipher.login.uris.length === 1 &&
                (this.cipher.login.uris[0].uri == null || this.cipher.login.uris[0].uri === '')) {
                this.cipher.login.uris = null;
            }
            if (!this.editMode && this.cipher.organizationId != null) {
                this.cipher.collectionIds = this.collections == null ? [] :
                    this.collections.filter((c) => c.checked).map((c) => c.id);
            }
            const cipher = yield this.encryptCipher();
            try {
                this.formPromise = this.saveCipher(cipher);
                yield this.formPromise;
                this.cipher.id = cipher.id;
                this.platformUtilsService.eventTrack(this.editMode ? 'Edited Cipher' : 'Added Cipher');
                this.platformUtilsService.showToast('success', null, this.i18nService.t(this.editMode ? 'editedItem' : 'addedItem'));
                this.onSavedCipher.emit(this.cipher);
                this.messagingService.send(this.editMode ? 'editedCipher' : 'addedCipher');
                return true;
            }
            catch (_a) { }
            return false;
        });
    }
    addUri() {
        if (this.cipher.type !== cipherType_1.CipherType.Login) {
            return;
        }
        if (this.cipher.login.uris == null) {
            this.cipher.login.uris = [];
        }
        this.cipher.login.uris.push(new loginUriView_1.LoginUriView());
    }
    removeUri(uri) {
        if (this.cipher.type !== cipherType_1.CipherType.Login || this.cipher.login.uris == null) {
            return;
        }
        const i = this.cipher.login.uris.indexOf(uri);
        if (i > -1) {
            this.cipher.login.uris.splice(i, 1);
        }
    }
    addField() {
        if (this.cipher.fields == null) {
            this.cipher.fields = [];
        }
        const f = new fieldView_1.FieldView();
        f.type = this.addFieldType;
        this.cipher.fields.push(f);
    }
    removeField(field) {
        const i = this.cipher.fields.indexOf(field);
        if (i > -1) {
            this.cipher.fields.splice(i, 1);
        }
    }
    trackByFunction(index, item) {
        return index;
    }
    cancel() {
        this.onCancelled.emit(this.cipher);
    }
    attachments() {
        this.onEditAttachments.emit(this.cipher);
    }
    share() {
        this.onShareCipher.emit(this.cipher);
    }
    editCollections() {
        this.onEditCollections.emit(this.cipher);
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const confirmed = yield this.platformUtilsService.showDialog(this.i18nService.t('deleteItemConfirmation'), this.i18nService.t('deleteItem'), this.i18nService.t('yes'), this.i18nService.t('no'), 'warning');
            if (!confirmed) {
                return false;
            }
            try {
                this.deletePromise = this.deleteCipher();
                yield this.deletePromise;
                this.platformUtilsService.eventTrack('Deleted Cipher');
                this.platformUtilsService.showToast('success', null, this.i18nService.t('deletedItem'));
                this.onDeletedCipher.emit(this.cipher);
                this.messagingService.send('deletedCipher');
            }
            catch (_a) { }
            return true;
        });
    }
    generatePassword() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cipher.login != null && this.cipher.login.password != null && this.cipher.login.password.length) {
                const confirmed = yield this.platformUtilsService.showDialog(this.i18nService.t('overwritePasswordConfirmation'), this.i18nService.t('overwritePassword'), this.i18nService.t('yes'), this.i18nService.t('no'));
                if (!confirmed) {
                    return false;
                }
            }
            this.onGeneratePassword.emit();
            return true;
        });
    }
    togglePassword() {
        this.platformUtilsService.eventTrack('Toggled Password on Edit');
        this.showPassword = !this.showPassword;
        document.getElementById('loginPassword').focus();
    }
    toggleCardCode() {
        this.platformUtilsService.eventTrack('Toggled CardCode on Edit');
        this.showCardCode = !this.showCardCode;
        document.getElementById('cardCode').focus();
    }
    toggleFieldValue(field) {
        const f = field;
        f.showValue = !f.showValue;
    }
    toggleUriOptions(uri) {
        const u = uri;
        u.showOptions = u.showOptions == null && uri.match != null ? false : !u.showOptions;
    }
    loginUriMatchChanged(uri) {
        const u = uri;
        u.showOptions = u.showOptions == null ? true : u.showOptions;
    }
    drop(event) {
        drag_drop_1.moveItemInArray(this.cipher.fields, event.previousIndex, event.currentIndex);
    }
    organizationChanged() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.writeableCollections != null) {
                this.writeableCollections.forEach((c) => c.checked = false);
            }
            if (this.cipher.organizationId != null) {
                this.collections = this.writeableCollections.filter((c) => c.organizationId === this.cipher.organizationId);
                const org = yield this.userService.getOrganization(this.cipher.organizationId);
                if (org != null) {
                    this.cipher.organizationUseTotp = org.useTotp;
                }
            }
            else {
                this.collections = [];
            }
        });
    }
    checkPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.checkPasswordPromise != null) {
                return;
            }
            if (this.cipher.login == null || this.cipher.login.password == null || this.cipher.login.password === '') {
                return;
            }
            this.platformUtilsService.eventTrack('Check Password');
            this.checkPasswordPromise = this.auditService.passwordLeaked(this.cipher.login.password);
            const matches = yield this.checkPasswordPromise;
            this.checkPasswordPromise = null;
            if (matches > 0) {
                this.platformUtilsService.showToast('warning', null, this.i18nService.t('passwordExposed', matches.toString()));
            }
            else {
                this.platformUtilsService.showToast('success', null, this.i18nService.t('passwordSafe'));
            }
        });
    }
    loadCollections() {
        return __awaiter(this, void 0, void 0, function* () {
            const allCollections = yield this.collectionService.getAllDecrypted();
            return allCollections.filter((c) => !c.readOnly);
        });
    }
    loadCipher() {
        return this.cipherService.get(this.cipherId);
    }
    encryptCipher() {
        return this.cipherService.encrypt(this.cipher);
    }
    saveCipher(cipher) {
        return this.cipherService.saveWithServer(cipher);
    }
    deleteCipher() {
        return this.cipherService.deleteWithServer(this.cipher.id);
    }
}
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AddEditComponent.prototype, "folderId", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AddEditComponent.prototype, "cipherId", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], AddEditComponent.prototype, "type", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], AddEditComponent.prototype, "collectionIds", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AddEditComponent.prototype, "organizationId", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AddEditComponent.prototype, "onSavedCipher", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AddEditComponent.prototype, "onDeletedCipher", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AddEditComponent.prototype, "onCancelled", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AddEditComponent.prototype, "onEditAttachments", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AddEditComponent.prototype, "onShareCipher", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AddEditComponent.prototype, "onEditCollections", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AddEditComponent.prototype, "onGeneratePassword", void 0);
exports.AddEditComponent = AddEditComponent;
//# sourceMappingURL=add-edit.component.js.map