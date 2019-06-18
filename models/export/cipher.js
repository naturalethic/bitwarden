"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cipherType_1 = require("../../enums/cipherType");
const cipherView_1 = require("../view/cipherView");
const card_1 = require("./card");
const field_1 = require("./field");
const identity_1 = require("./identity");
const login_1 = require("./login");
const secureNote_1 = require("./secureNote");
class Cipher {
    static template() {
        const req = new Cipher();
        req.organizationId = null;
        req.folderId = null;
        req.type = cipherType_1.CipherType.Login;
        req.name = 'Item name';
        req.notes = 'Some notes about this item.';
        req.favorite = false;
        req.fields = [];
        req.login = null;
        req.secureNote = null;
        req.card = null;
        req.identity = null;
        return req;
    }
    static toView(req, view = new cipherView_1.CipherView()) {
        view.type = req.type;
        view.folderId = req.folderId;
        if (view.organizationId == null) {
            view.organizationId = req.organizationId;
        }
        view.name = req.name;
        view.notes = req.notes;
        view.favorite = req.favorite;
        if (req.fields != null) {
            view.fields = req.fields.map((f) => field_1.Field.toView(f));
        }
        switch (req.type) {
            case cipherType_1.CipherType.Login:
                view.login = login_1.Login.toView(req.login);
                break;
            case cipherType_1.CipherType.SecureNote:
                view.secureNote = secureNote_1.SecureNote.toView(req.secureNote);
                break;
            case cipherType_1.CipherType.Card:
                view.card = card_1.Card.toView(req.card);
                break;
            case cipherType_1.CipherType.Identity:
                view.identity = identity_1.Identity.toView(req.identity);
                break;
        }
        return view;
    }
    // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
    build(o) {
        this.organizationId = o.organizationId;
        this.folderId = o.folderId;
        this.type = o.type;
        this.name = o.name;
        this.notes = o.notes;
        this.favorite = o.favorite;
        if (o.fields != null) {
            this.fields = o.fields.map((f) => new field_1.Field(f));
        }
        switch (o.type) {
            case cipherType_1.CipherType.Login:
                this.login = new login_1.Login(o.login);
                break;
            case cipherType_1.CipherType.SecureNote:
                this.secureNote = new secureNote_1.SecureNote(o.secureNote);
                break;
            case cipherType_1.CipherType.Card:
                this.card = new card_1.Card(o.card);
                break;
            case cipherType_1.CipherType.Identity:
                this.identity = new identity_1.Identity(o.identity);
                break;
        }
    }
}
exports.Cipher = Cipher;
//# sourceMappingURL=cipher.js.map