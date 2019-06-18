"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class U2f {
    constructor(win, webVaultUrl, successCallback, errorCallback, infoCallback) {
        this.win = win;
        this.webVaultUrl = webVaultUrl;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        this.infoCallback = infoCallback;
        this.iframe = null;
        this.parseFunction = this.parseMessage.bind(this);
        this.connectorLink = win.document.createElement('a');
        this.webVaultUrl = webVaultUrl != null && webVaultUrl !== '' ? webVaultUrl : 'https://vault.bitwarden.com';
    }
    init(data) {
        this.connectorLink.href = this.webVaultUrl + '/u2f-connector.html' +
            '?data=' + this.base64Encode(JSON.stringify(data)) +
            '&parent=' + encodeURIComponent(this.win.document.location.href) +
            '&v=1';
        this.iframe = this.win.document.getElementById('u2f_iframe');
        this.iframe.src = this.connectorLink.href;
        this.win.addEventListener('message', this.parseFunction, false);
    }
    stop() {
        this.sendMessage('stop');
    }
    start() {
        this.sendMessage('start');
    }
    sendMessage(message) {
        if (!this.iframe || !this.iframe.src || !this.iframe.contentWindow) {
            return;
        }
        this.iframe.contentWindow.postMessage(message, this.iframe.src);
    }
    base64Encode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode(('0x' + p1));
        }));
    }
    cleanup() {
        this.win.removeEventListener('message', this.parseFunction, false);
    }
    parseMessage(event) {
        if (!this.validMessage(event)) {
            return;
        }
        const parts = event.data.split('|');
        if (parts[0] === 'success' && this.successCallback) {
            this.successCallback(parts[1]);
        }
        else if (parts[0] === 'error' && this.errorCallback) {
            this.errorCallback(parts[1]);
        }
        else if (parts[0] === 'info' && this.infoCallback) {
            this.infoCallback(parts[1]);
        }
    }
    validMessage(event) {
        if (event.origin == null || event.origin === '' || event.origin !== this.connectorLink.origin ||
            event.data == null || typeof (event.data) !== 'string') {
            return false;
        }
        return event.data.indexOf('success|') === 0 || event.data.indexOf('error|') === 0 ||
            event.data.indexOf('info|') === 0;
    }
}
exports.U2f = U2f;
//# sourceMappingURL=u2f.js.map