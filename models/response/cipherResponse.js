"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attachmentResponse_1 = require("./attachmentResponse");
const baseResponse_1 = require("./baseResponse");
const passwordHistoryResponse_1 = require("./passwordHistoryResponse");
const cardApi_1 = require("../api/cardApi");
const fieldApi_1 = require("../api/fieldApi");
const identityApi_1 = require("../api/identityApi");
const loginApi_1 = require("../api/loginApi");
const secureNoteApi_1 = require("../api/secureNoteApi");
class CipherResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty('Id');
        this.organizationId = this.getResponseProperty('OrganizationId');
        this.folderId = this.getResponseProperty('FolderId') || null;
        this.type = this.getResponseProperty('Type');
        this.name = this.getResponseProperty('Name');
        this.notes = this.getResponseProperty('Notes');
        this.favorite = this.getResponseProperty('Favorite') || false;
        this.edit = this.getResponseProperty('Edit') || true;
        this.organizationUseTotp = this.getResponseProperty('OrganizationUseTotp');
        this.revisionDate = this.getResponseProperty('RevisionDate');
        this.collectionIds = this.getResponseProperty('CollectionIds');
        const login = this.getResponseProperty('Login');
        if (login != null) {
            this.login = new loginApi_1.LoginApi(login);
        }
        const card = this.getResponseProperty('Card');
        if (card != null) {
            this.card = new cardApi_1.CardApi(card);
        }
        const identity = this.getResponseProperty('Identity');
        if (identity != null) {
            this.identity = new identityApi_1.IdentityApi(identity);
        }
        const secureNote = this.getResponseProperty('SecureNote');
        if (secureNote != null) {
            this.secureNote = new secureNoteApi_1.SecureNoteApi(secureNote);
        }
        const fields = this.getResponseProperty('Fields');
        if (fields != null) {
            this.fields = fields.map((f) => new fieldApi_1.FieldApi(f));
        }
        const attachments = this.getResponseProperty('Attachments');
        if (attachments != null) {
            this.attachments = attachments.map((a) => new attachmentResponse_1.AttachmentResponse(a));
        }
        const passwordHistory = this.getResponseProperty('PasswordHistory');
        if (passwordHistory != null) {
            this.passwordHistory = passwordHistory.map((h) => new passwordHistoryResponse_1.PasswordHistoryResponse(h));
        }
    }
}
exports.CipherResponse = CipherResponse;
//# sourceMappingURL=cipherResponse.js.map