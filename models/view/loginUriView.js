"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uriMatchType_1 = require("../../enums/uriMatchType");
const utils_1 = require("../../misc/utils");
const CanLaunchWhitelist = [
    'https://',
    'http://',
    'ssh://',
    'ftp://',
    'sftp://',
    'irc://',
    'vnc://',
    'chrome://',
    'iosapp://',
    'androidapp://',
];
class LoginUriView {
    // tslint:enable
    constructor(u) {
        this.match = null;
        // tslint:disable
        this._uri = null;
        this._domain = null;
        this._hostname = null;
        this._canLaunch = null;
        if (!u) {
            return;
        }
        this.match = u.match;
    }
    get uri() {
        return this._uri;
    }
    set uri(value) {
        this._uri = value;
        this._domain = null;
        this._canLaunch = null;
    }
    get domain() {
        if (this._domain == null && this.uri != null) {
            this._domain = utils_1.Utils.getDomain(this.uri);
            if (this._domain === '') {
                this._domain = null;
            }
        }
        return this._domain;
    }
    get hostname() {
        if (this._hostname == null && this.uri != null) {
            this._hostname = utils_1.Utils.getHostname(this.uri);
            if (this._hostname === '') {
                this._hostname = null;
            }
        }
        return this._hostname;
    }
    get hostnameOrUri() {
        return this.hostname != null ? this.hostname : this.uri;
    }
    get isWebsite() {
        return this.uri != null && (this.uri.indexOf('http://') === 0 || this.uri.indexOf('https://') === 0 ||
            (this.uri.indexOf('://') < 0 && utils_1.Utils.tldEndingRegex.test(this.uri)));
    }
    get canLaunch() {
        if (this._canLaunch != null) {
            return this._canLaunch;
        }
        if (this.uri != null && this.match !== uriMatchType_1.UriMatchType.RegularExpression) {
            const uri = this.launchUri;
            for (let i = 0; i < CanLaunchWhitelist.length; i++) {
                if (uri.indexOf(CanLaunchWhitelist[i]) === 0) {
                    this._canLaunch = true;
                    return this._canLaunch;
                }
            }
        }
        this._canLaunch = false;
        return this._canLaunch;
    }
    get launchUri() {
        return this.uri.indexOf('://') < 0 && utils_1.Utils.tldEndingRegex.test(this.uri) ? ('http://' + this.uri) : this.uri;
    }
}
exports.LoginUriView = LoginUriView;
//# sourceMappingURL=loginUriView.js.map