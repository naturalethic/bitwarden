"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginUriView_1 = require("../view/loginUriView");
class LoginUri {
    constructor(o) {
        this.match = null;
        if (o == null) {
            return;
        }
        this.uri = o.uri;
        this.match = o.match;
    }
    static template() {
        const req = new LoginUri();
        req.uri = 'https://google.com';
        req.match = null;
        return req;
    }
    static toView(req, view = new loginUriView_1.LoginUriView()) {
        view.uri = req.uri;
        view.match = req.match;
        return view;
    }
}
exports.LoginUri = LoginUri;
//# sourceMappingURL=loginUri.js.map