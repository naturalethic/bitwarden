"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deviceType_1 = require("../../enums/deviceType");
class CliPlatformUtilsService {
    constructor(identityClientId, packageJson) {
        this.packageJson = packageJson;
        this.deviceCache = null;
        this.identityClientId = identityClientId;
    }
    getDevice() {
        if (!this.deviceCache) {
            switch (process.platform) {
                case 'win32':
                    this.deviceCache = deviceType_1.DeviceType.WindowsDesktop;
                    break;
                case 'darwin':
                    this.deviceCache = deviceType_1.DeviceType.MacOsDesktop;
                    break;
                case 'linux':
                default:
                    this.deviceCache = deviceType_1.DeviceType.LinuxDesktop;
                    break;
            }
        }
        return this.deviceCache;
    }
    getDeviceString() {
        const device = deviceType_1.DeviceType[this.getDevice()].toLowerCase();
        return device.replace('desktop', '');
    }
    isFirefox() {
        return false;
    }
    isChrome() {
        return false;
    }
    isEdge() {
        return false;
    }
    isOpera() {
        return false;
    }
    isVivaldi() {
        return false;
    }
    isSafari() {
        return false;
    }
    isIE() {
        return false;
    }
    isMacAppStore() {
        return false;
    }
    analyticsId() {
        return null;
    }
    isViewOpen() {
        return false;
    }
    lockTimeout() {
        return null;
    }
    launchUri(uri, options) {
        throw new Error('Not implemented.');
    }
    saveFile(win, blobData, blobOptions, fileName) {
        throw new Error('Not implemented.');
    }
    getApplicationVersion() {
        return this.packageJson.version;
    }
    supportsU2f(win) {
        return false;
    }
    supportsDuo() {
        return false;
    }
    showToast(type, title, text, options) {
        throw new Error('Not implemented.');
    }
    showDialog(text, title, confirmText, cancelText, type) {
        throw new Error('Not implemented.');
    }
    eventTrack(action, label, options) {
        throw new Error('Not implemented.');
    }
    isDev() {
        return process.env.BWCLI_ENV === 'development';
    }
    isSelfHost() {
        return false;
    }
    copyToClipboard(text, options) {
        throw new Error('Not implemented.');
    }
    readFromClipboard(options) {
        throw new Error('Not implemented.');
    }
}
exports.CliPlatformUtilsService = CliPlatformUtilsService;
//# sourceMappingURL=cliPlatformUtils.service.js.map