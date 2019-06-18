"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secureNoteType_1 = require("../../enums/secureNoteType");
const secureNoteView_1 = require("../view/secureNoteView");
class SecureNote {
    static template() {
        const req = new SecureNote();
        req.type = secureNoteType_1.SecureNoteType.Generic;
        return req;
    }
    static toView(req, view = new secureNoteView_1.SecureNoteView()) {
        view.type = req.type;
        return view;
    }
    constructor(o) {
        if (o == null) {
            return;
        }
        this.type = o.type;
    }
}
exports.SecureNote = SecureNote;
//# sourceMappingURL=secureNote.js.map