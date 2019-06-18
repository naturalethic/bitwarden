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
class AttachmentsComponent {
    constructor(cipherService, i18nService, cryptoService, userService, platformUtilsService, win) {
        this.cipherService = cipherService;
        this.i18nService = i18nService;
        this.cryptoService = cryptoService;
        this.userService = userService;
        this.platformUtilsService = platformUtilsService;
        this.win = win;
        this.onUploadedAttachment = new core_1.EventEmitter();
        this.onDeletedAttachment = new core_1.EventEmitter();
        this.onReuploadedAttachment = new core_1.EventEmitter();
        this.deletePromises = {};
        this.reuploadPromises = {};
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
        });
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hasUpdatedKey) {
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('updateKey'));
                return;
            }
            const fileEl = document.getElementById('file');
            const files = fileEl.files;
            if (files == null || files.length === 0) {
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('selectFile'));
                return;
            }
            if (files[0].size > 104857600) { // 100 MB
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('maxFileSize'));
                return;
            }
            try {
                this.formPromise = this.saveCipherAttachment(files[0]);
                this.cipherDomain = yield this.formPromise;
                this.cipher = yield this.cipherDomain.decrypt();
                this.platformUtilsService.eventTrack('Added Attachment');
                this.platformUtilsService.showToast('success', null, this.i18nService.t('attachmentSaved'));
                this.onUploadedAttachment.emit();
            }
            catch (_a) { }
            // reset file input
            // ref: https://stackoverflow.com/a/20552042
            fileEl.type = '';
            fileEl.type = 'file';
            fileEl.value = '';
        });
    }
    delete(attachment) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.deletePromises[attachment.id] != null) {
                return;
            }
            const confirmed = yield this.platformUtilsService.showDialog(this.i18nService.t('deleteAttachmentConfirmation'), this.i18nService.t('deleteAttachment'), this.i18nService.t('yes'), this.i18nService.t('no'), 'warning');
            if (!confirmed) {
                return;
            }
            try {
                this.deletePromises[attachment.id] = this.deleteCipherAttachment(attachment.id);
                yield this.deletePromises[attachment.id];
                this.platformUtilsService.eventTrack('Deleted Attachment');
                this.platformUtilsService.showToast('success', null, this.i18nService.t('deletedAttachment'));
                const i = this.cipher.attachments.indexOf(attachment);
                if (i > -1) {
                    this.cipher.attachments.splice(i, 1);
                }
            }
            catch (_a) { }
            this.deletePromises[attachment.id] = null;
            this.onDeletedAttachment.emit();
        });
    }
    download(attachment) {
        return __awaiter(this, void 0, void 0, function* () {
            const a = attachment;
            if (a.downloading) {
                return;
            }
            if (!this.canAccessAttachments) {
                this.platformUtilsService.showToast('error', this.i18nService.t('premiumRequired'), this.i18nService.t('premiumRequiredDesc'));
                return;
            }
            a.downloading = true;
            const response = yield fetch(new Request(attachment.url, { cache: 'no-cache' }));
            if (response.status !== 200) {
                this.platformUtilsService.showToast('error', null, this.i18nService.t('errorOccurred'));
                a.downloading = false;
                return;
            }
            try {
                const buf = yield response.arrayBuffer();
                const key = attachment.key != null ? attachment.key :
                    yield this.cryptoService.getOrgKey(this.cipher.organizationId);
                const decBuf = yield this.cryptoService.decryptFromBytes(buf, key);
                this.platformUtilsService.saveFile(this.win, decBuf, null, attachment.fileName);
            }
            catch (e) {
                this.platformUtilsService.showToast('error', null, this.i18nService.t('errorOccurred'));
            }
            a.downloading = false;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cipherDomain = yield this.loadCipher();
            this.cipher = yield this.cipherDomain.decrypt();
            this.hasUpdatedKey = yield this.cryptoService.hasEncKey();
            const canAccessPremium = yield this.userService.canAccessPremium();
            this.canAccessAttachments = canAccessPremium || this.cipher.organizationId != null;
            if (!this.canAccessAttachments) {
                const confirmed = yield this.platformUtilsService.showDialog(this.i18nService.t('premiumRequiredDesc'), this.i18nService.t('premiumRequired'), this.i18nService.t('learnMore'), this.i18nService.t('cancel'));
                if (confirmed) {
                    this.platformUtilsService.launchUri('https://vault.bitwarden.com/#/?premium=purchase');
                }
            }
            else if (!this.hasUpdatedKey) {
                const confirmed = yield this.platformUtilsService.showDialog(this.i18nService.t('updateKey'), this.i18nService.t('featureUnavailable'), this.i18nService.t('learnMore'), this.i18nService.t('cancel'), 'warning');
                if (confirmed) {
                    this.platformUtilsService.launchUri('https://help.bitwarden.com/article/update-encryption-key/');
                }
            }
        });
    }
    reuploadCipherAttachment(attachment, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            const a = attachment;
            if (attachment.key != null || a.downloading || this.reuploadPromises[attachment.id] != null) {
                return;
            }
            try {
                this.reuploadPromises[attachment.id] = Promise.resolve().then(() => __awaiter(this, void 0, void 0, function* () {
                    // 1. Download
                    a.downloading = true;
                    const response = yield fetch(new Request(attachment.url, { cache: 'no-cache' }));
                    if (response.status !== 200) {
                        this.platformUtilsService.showToast('error', null, this.i18nService.t('errorOccurred'));
                        a.downloading = false;
                        return;
                    }
                    try {
                        // 2. Resave
                        const buf = yield response.arrayBuffer();
                        const key = attachment.key != null ? attachment.key :
                            yield this.cryptoService.getOrgKey(this.cipher.organizationId);
                        const decBuf = yield this.cryptoService.decryptFromBytes(buf, key);
                        this.cipherDomain = yield this.cipherService.saveAttachmentRawWithServer(this.cipherDomain, attachment.fileName, decBuf, admin);
                        this.cipher = yield this.cipherDomain.decrypt();
                        // 3. Delete old
                        this.deletePromises[attachment.id] = this.deleteCipherAttachment(attachment.id);
                        yield this.deletePromises[attachment.id];
                        const foundAttachment = this.cipher.attachments.filter((a2) => a2.id === attachment.id);
                        if (foundAttachment.length > 0) {
                            const i = this.cipher.attachments.indexOf(foundAttachment[0]);
                            if (i > -1) {
                                this.cipher.attachments.splice(i, 1);
                            }
                        }
                        this.platformUtilsService.eventTrack('Reuploaded Attachment');
                        this.platformUtilsService.showToast('success', null, this.i18nService.t('attachmentSaved'));
                        this.onReuploadedAttachment.emit();
                    }
                    catch (e) {
                        this.platformUtilsService.showToast('error', null, this.i18nService.t('errorOccurred'));
                    }
                    a.downloading = false;
                }));
                yield this.reuploadPromises[attachment.id];
            }
            catch (_a) { }
        });
    }
    loadCipher() {
        return this.cipherService.get(this.cipherId);
    }
    saveCipherAttachment(file) {
        return this.cipherService.saveAttachmentWithServer(this.cipherDomain, file);
    }
    deleteCipherAttachment(attachmentId) {
        return this.cipherService.deleteAttachmentWithServer(this.cipher.id, attachmentId);
    }
}
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AttachmentsComponent.prototype, "cipherId", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AttachmentsComponent.prototype, "onUploadedAttachment", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AttachmentsComponent.prototype, "onDeletedAttachment", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AttachmentsComponent.prototype, "onReuploadedAttachment", void 0);
exports.AttachmentsComponent = AttachmentsComponent;
//# sourceMappingURL=attachments.component.js.map