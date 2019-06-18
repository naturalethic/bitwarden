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
const loginUri_1 = require("./loginUri");
const loginData_1 = require("../data/loginData");
const loginView_1 = require("../view/loginView");
const domainBase_1 = require("./domainBase");
class Login extends domainBase_1.default {
    constructor(obj, alreadyEncrypted = false) {
        super();
        if (obj == null) {
            return;
        }
        this.passwordRevisionDate = obj.passwordRevisionDate != null ? new Date(obj.passwordRevisionDate) : null;
        this.buildDomainModel(this, obj, {
            username: null,
            password: null,
            totp: null,
        }, alreadyEncrypted, []);
        if (obj.uris) {
            this.uris = [];
            obj.uris.forEach((u) => {
                this.uris.push(new loginUri_1.LoginUri(u, alreadyEncrypted));
            });
        }
    }
    decrypt(orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            const view = yield this.decryptObj(new loginView_1.LoginView(this), {
                username: null,
                password: null,
                totp: null,
            }, orgId);
            if (this.uris != null) {
                view.uris = [];
                for (let i = 0; i < this.uris.length; i++) {
                    const uri = yield this.uris[i].decrypt(orgId);
                    view.uris.push(uri);
                }
            }
            return view;
        });
    }
    toLoginData() {
        const l = new loginData_1.LoginData();
        l.passwordRevisionDate = this.passwordRevisionDate != null ? this.passwordRevisionDate.toISOString() : null;
        this.buildDataModel(this, l, {
            username: null,
            password: null,
            totp: null,
        });
        if (this.uris != null && this.uris.length > 0) {
            l.uris = [];
            this.uris.forEach((u) => {
                l.uris.push(u.toLoginUriData());
            });
        }
        return l;
    }
}
exports.Login = Login;
//# sourceMappingURL=login.js.map