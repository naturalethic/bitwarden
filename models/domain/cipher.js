"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cipherType_1 = require("../../enums/cipherType");
const cipherData_1 = require("../data/cipherData");
const cipherView_1 = require("../view/cipherView");
const attachment_1 = require("./attachment");
const card_1 = require("./card");
const domainBase_1 = require("./domainBase");
const field_1 = require("./field");
const identity_1 = require("./identity");
const login_1 = require("./login");
const password_1 = require("./password");
const secureNote_1 = require("./secureNote");
class Cipher extends domainBase_1.default {
    constructor(obj, alreadyEncrypted = false, localData = null) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            id: null,
            userId: null,
            organizationId: null,
            folderId: null,
            name: null,
            notes: null,
        }, alreadyEncrypted, ['id', 'userId', 'organizationId', 'folderId']);
        this.type = obj.type;
        this.favorite = obj.favorite;
        this.organizationUseTotp = obj.organizationUseTotp;
        this.edit = obj.edit;
        this.revisionDate = obj.revisionDate != null ? new Date(obj.revisionDate) : null;
        this.collectionIds = obj.collectionIds;
        this.localData = localData;
        switch (this.type) {
            case cipherType_1.CipherType.Login:
                this.login = new login_1.Login(obj.login, alreadyEncrypted);
                break;
            case cipherType_1.CipherType.SecureNote:
                this.secureNote = new secureNote_1.SecureNote(obj.secureNote, alreadyEncrypted);
                break;
            case cipherType_1.CipherType.Card:
                this.card = new card_1.Card(obj.card, alreadyEncrypted);
                break;
            case cipherType_1.CipherType.Identity:
                this.identity = new identity_1.Identity(obj.identity, alreadyEncrypted);
                break;
            default:
                break;
        }
        if (obj.attachments != null) {
            this.attachments = obj.attachments.map((a) => new attachment_1.Attachment(a, alreadyEncrypted));
        }
        else {
            this.attachments = null;
        }
        if (obj.fields != null) {
            this.fields = obj.fields.map((f) => new field_1.Field(f, alreadyEncrypted));
        }
        else {
            this.fields = null;
        }
        if (obj.passwordHistory != null) {
            this.passwordHistory = obj.passwordHistory.map((ph) => new password_1.Password(ph, alreadyEncrypted));
        }
        else {
            this.passwordHistory = null;
        }
    }
    decrypt() {
        return __awaiter(this, void 0, void 0, function* () {
            const model = new cipherView_1.CipherView(this);
            yield this.decryptObj(model, {
                name: null,
                notes: null,
            }, this.organizationId);
            switch (this.type) {
                case cipherType_1.CipherType.Login:
                    model.login = yield this.login.decrypt(this.organizationId);
                    break;
                case cipherType_1.CipherType.SecureNote:
                    model.secureNote = yield this.secureNote.decrypt(this.organizationId);
                    break;
                case cipherType_1.CipherType.Card:
                    model.card = yield this.card.decrypt(this.organizationId);
                    break;
                case cipherType_1.CipherType.Identity:
                    model.identity = yield this.identity.decrypt(this.organizationId);
                    break;
                default:
                    break;
            }
            const orgId = this.organizationId;
            if (this.attachments != null && this.attachments.length > 0) {
                const attachments = [];
                yield this.attachments.reduce((promise, attachment) => {
                    return promise.then(() => {
                        return attachment.decrypt(orgId);
                    }).then((decAttachment) => {
                        attachments.push(decAttachment);
                    });
                }, Promise.resolve());
                model.attachments = attachments;
            }
            if (this.fields != null && this.fields.length > 0) {
                const fields = [];
                yield this.fields.reduce((promise, field) => {
                    return promise.then(() => {
                        return field.decrypt(orgId);
                    }).then((decField) => {
                        fields.push(decField);
                    });
                }, Promise.resolve());
                model.fields = fields;
            }
            if (this.passwordHistory != null && this.passwordHistory.length > 0) {
                const passwordHistory = [];
                yield this.passwordHistory.reduce((promise, ph) => {
                    return promise.then(() => {
                        return ph.decrypt(orgId);
                    }).then((decPh) => {
                        passwordHistory.push(decPh);
                    });
                }, Promise.resolve());
                model.passwordHistory = passwordHistory;
            }
            return model;
        });
    }
    toCipherData(userId) {
        const c = new cipherData_1.CipherData();
        c.id = this.id;
        c.organizationId = this.organizationId;
        c.folderId = this.folderId;
        c.userId = this.organizationId != null ? userId : null;
        c.edit = this.edit;
        c.organizationUseTotp = this.organizationUseTotp;
        c.favorite = this.favorite;
        c.revisionDate = this.revisionDate != null ? this.revisionDate.toISOString() : null;
        c.type = this.type;
        c.collectionIds = this.collectionIds;
        this.buildDataModel(this, c, {
            name: null,
            notes: null,
        });
        switch (c.type) {
            case cipherType_1.CipherType.Login:
                c.login = this.login.toLoginData();
                break;
            case cipherType_1.CipherType.SecureNote:
                c.secureNote = this.secureNote.toSecureNoteData();
                break;
            case cipherType_1.CipherType.Card:
                c.card = this.card.toCardData();
                break;
            case cipherType_1.CipherType.Identity:
                c.identity = this.identity.toIdentityData();
                break;
            default:
                break;
        }
        if (this.fields != null) {
            c.fields = this.fields.map((f) => f.toFieldData());
        }
        if (this.attachments != null) {
            c.attachments = this.attachments.map((a) => a.toAttachmentData());
        }
        if (this.passwordHistory != null) {
            c.passwordHistory = this.passwordHistory.map((ph) => ph.toPasswordHistoryData());
        }
        return c;
    }
}
exports.Cipher = Cipher;
//# sourceMappingURL=cipher.js.map