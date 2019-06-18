"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cipherType_1 = require("../../enums/cipherType");
const cardApi_1 = require("../api/cardApi");
const fieldApi_1 = require("../api/fieldApi");
const identityApi_1 = require("../api/identityApi");
const loginApi_1 = require("../api/loginApi");
const loginUriApi_1 = require("../api/loginUriApi");
const secureNoteApi_1 = require("../api/secureNoteApi");
const attachmentRequest_1 = require("./attachmentRequest");
class CipherRequest {
    constructor(cipher) {
        this.type = cipher.type;
        this.folderId = cipher.folderId;
        this.organizationId = cipher.organizationId;
        this.name = cipher.name ? cipher.name.encryptedString : null;
        this.notes = cipher.notes ? cipher.notes.encryptedString : null;
        this.favorite = cipher.favorite;
        switch (this.type) {
            case cipherType_1.CipherType.Login:
                this.login = new loginApi_1.LoginApi();
                this.login.uris = null;
                this.login.username = cipher.login.username ? cipher.login.username.encryptedString : null;
                this.login.password = cipher.login.password ? cipher.login.password.encryptedString : null;
                this.login.passwordRevisionDate = cipher.login.passwordRevisionDate != null ?
                    cipher.login.passwordRevisionDate.toISOString() : null;
                this.login.totp = cipher.login.totp ? cipher.login.totp.encryptedString : null;
                if (cipher.login.uris != null) {
                    this.login.uris = cipher.login.uris.map((u) => {
                        const uri = new loginUriApi_1.LoginUriApi();
                        uri.uri = u.uri != null ? u.uri.encryptedString : null;
                        uri.match = u.match != null ? u.match : null;
                        return uri;
                    });
                }
                break;
            case cipherType_1.CipherType.SecureNote:
                this.secureNote = new secureNoteApi_1.SecureNoteApi();
                this.secureNote.type = cipher.secureNote.type;
                break;
            case cipherType_1.CipherType.Card:
                this.card = new cardApi_1.CardApi();
                this.card.cardholderName = cipher.card.cardholderName != null ?
                    cipher.card.cardholderName.encryptedString : null;
                this.card.brand = cipher.card.brand != null ? cipher.card.brand.encryptedString : null;
                this.card.number = cipher.card.number != null ? cipher.card.number.encryptedString : null;
                this.card.expMonth = cipher.card.expMonth != null ? cipher.card.expMonth.encryptedString : null;
                this.card.expYear = cipher.card.expYear != null ? cipher.card.expYear.encryptedString : null;
                this.card.code = cipher.card.code != null ? cipher.card.code.encryptedString : null;
                break;
            case cipherType_1.CipherType.Identity:
                this.identity = new identityApi_1.IdentityApi();
                this.identity.title = cipher.identity.title != null ? cipher.identity.title.encryptedString : null;
                this.identity.firstName = cipher.identity.firstName != null ?
                    cipher.identity.firstName.encryptedString : null;
                this.identity.middleName = cipher.identity.middleName != null ?
                    cipher.identity.middleName.encryptedString : null;
                this.identity.lastName = cipher.identity.lastName != null ?
                    cipher.identity.lastName.encryptedString : null;
                this.identity.address1 = cipher.identity.address1 != null ?
                    cipher.identity.address1.encryptedString : null;
                this.identity.address2 = cipher.identity.address2 != null ?
                    cipher.identity.address2.encryptedString : null;
                this.identity.address3 = cipher.identity.address3 != null ?
                    cipher.identity.address3.encryptedString : null;
                this.identity.city = cipher.identity.city != null ? cipher.identity.city.encryptedString : null;
                this.identity.state = cipher.identity.state != null ? cipher.identity.state.encryptedString : null;
                this.identity.postalCode = cipher.identity.postalCode != null ?
                    cipher.identity.postalCode.encryptedString : null;
                this.identity.country = cipher.identity.country != null ?
                    cipher.identity.country.encryptedString : null;
                this.identity.company = cipher.identity.company != null ?
                    cipher.identity.company.encryptedString : null;
                this.identity.email = cipher.identity.email != null ? cipher.identity.email.encryptedString : null;
                this.identity.phone = cipher.identity.phone != null ? cipher.identity.phone.encryptedString : null;
                this.identity.ssn = cipher.identity.ssn != null ? cipher.identity.ssn.encryptedString : null;
                this.identity.username = cipher.identity.username != null ?
                    cipher.identity.username.encryptedString : null;
                this.identity.passportNumber = cipher.identity.passportNumber != null ?
                    cipher.identity.passportNumber.encryptedString : null;
                this.identity.licenseNumber = cipher.identity.licenseNumber != null ?
                    cipher.identity.licenseNumber.encryptedString : null;
                break;
            default:
                break;
        }
        if (cipher.fields != null) {
            this.fields = cipher.fields.map((f) => {
                const field = new fieldApi_1.FieldApi();
                field.type = f.type;
                field.name = f.name ? f.name.encryptedString : null;
                field.value = f.value ? f.value.encryptedString : null;
                return field;
            });
        }
        if (cipher.passwordHistory != null) {
            this.passwordHistory = [];
            cipher.passwordHistory.forEach((ph) => {
                this.passwordHistory.push({
                    lastUsedDate: ph.lastUsedDate,
                    password: ph.password ? ph.password.encryptedString : null,
                });
            });
        }
        if (cipher.attachments != null) {
            this.attachments = {};
            this.attachments2 = {};
            cipher.attachments.forEach((attachment) => {
                const fileName = attachment.fileName ? attachment.fileName.encryptedString : null;
                this.attachments[attachment.id] = fileName;
                const attachmentRequest = new attachmentRequest_1.AttachmentRequest();
                attachmentRequest.fileName = fileName;
                if (attachment.key != null) {
                    attachmentRequest.key = attachment.key.encryptedString;
                }
                this.attachments2[attachment.id] = attachmentRequest;
            });
        }
    }
}
exports.CipherRequest = CipherRequest;
//# sourceMappingURL=cipherRequest.js.map