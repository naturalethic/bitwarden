"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoginView {
    constructor(l) {
        this.username = null;
        this.password = null;
        this.passwordRevisionDate = null;
        this.totp = null;
        this.uris = null;
        if (!l) {
            return;
        }
        this.passwordRevisionDate = l.passwordRevisionDate;
    }
    get uri() {
        return this.hasUris ? this.uris[0].uri : null;
    }
    get maskedPassword() {
        return this.password != null ? '••••••••' : null;
    }
    get subTitle() {
        return this.username;
    }
    get canLaunch() {
        return this.hasUris && this.uris.some((u) => u.canLaunch);
    }
    get launchUri() {
        if (this.hasUris) {
            const uri = this.uris.find((u) => u.canLaunch);
            if (uri != null) {
                return uri.launchUri;
            }
        }
        return null;
    }
    get hasUris() {
        return this.uris != null && this.uris.length > 0;
    }
}
exports.LoginView = LoginView;
//# sourceMappingURL=loginView.js.map