"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginUri_1 = require("./loginUri");
const loginView_1 = require("../view/loginView");
class Login {
    static template() {
        const req = new Login();
        req.uris = [];
        req.username = 'jdoe';
        req.password = 'myp@ssword123';
        req.totp = 'JBSWY3DPEHPK3PXP';
        return req;
    }
    static toView(req, view = new loginView_1.LoginView()) {
        if (req.uris != null) {
            view.uris = req.uris.map((u) => loginUri_1.LoginUri.toView(u));
        }
        view.username = req.username;
        view.password = req.password;
        view.totp = req.totp;
        return view;
    }
    constructor(o) {
        if (o == null) {
            return;
        }
        if (o.uris != null) {
            this.uris = o.uris.map((u) => new loginUri_1.LoginUri(u));
        }
        this.username = o.username;
        this.password = o.password;
        this.totp = o.totp;
    }
}
exports.Login = Login;
//# sourceMappingURL=login.js.map