"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cipherType_1 = require("../../enums/cipherType");
const cardView_1 = require("./cardView");
const identityView_1 = require("./identityView");
const loginView_1 = require("./loginView");
const secureNoteView_1 = require("./secureNoteView");
class CipherView {
    constructor(c) {
        this.id = null;
        this.organizationId = null;
        this.folderId = null;
        this.name = null;
        this.notes = null;
        this.type = null;
        this.favorite = false;
        this.organizationUseTotp = false;
        this.edit = false;
        this.login = new loginView_1.LoginView();
        this.identity = new identityView_1.IdentityView();
        this.card = new cardView_1.CardView();
        this.secureNote = new secureNoteView_1.SecureNoteView();
        this.attachments = null;
        this.fields = null;
        this.passwordHistory = null;
        this.collectionIds = null;
        this.revisionDate = null;
        if (!c) {
            return;
        }
        this.id = c.id;
        this.organizationId = c.organizationId;
        this.folderId = c.folderId;
        this.favorite = c.favorite;
        this.organizationUseTotp = c.organizationUseTotp;
        this.edit = c.edit;
        this.type = c.type;
        this.localData = c.localData;
        this.collectionIds = c.collectionIds;
        this.revisionDate = c.revisionDate;
    }
    get subTitle() {
        switch (this.type) {
            case cipherType_1.CipherType.Login:
                return this.login.subTitle;
            case cipherType_1.CipherType.SecureNote:
                return this.secureNote.subTitle;
            case cipherType_1.CipherType.Card:
                return this.card.subTitle;
            case cipherType_1.CipherType.Identity:
                return this.identity.subTitle;
            default:
                break;
        }
        return null;
    }
    get hasPasswordHistory() {
        return this.passwordHistory && this.passwordHistory.length > 0;
    }
    get hasAttachments() {
        return this.attachments && this.attachments.length > 0;
    }
    get hasOldAttachments() {
        if (this.hasAttachments) {
            for (let i = 0; i < this.attachments.length; i++) {
                if (this.attachments[i].key == null) {
                    return true;
                }
            }
        }
        return false;
    }
    get hasFields() {
        return this.fields && this.fields.length > 0;
    }
    get passwordRevisionDisplayDate() {
        if (this.type !== cipherType_1.CipherType.Login || this.login == null) {
            return null;
        }
        else if (this.login.password == null || this.login.password === '') {
            return null;
        }
        return this.login.passwordRevisionDate;
    }
}
exports.CipherView = CipherView;
//# sourceMappingURL=cipherView.js.map