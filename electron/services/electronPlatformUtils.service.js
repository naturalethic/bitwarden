"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const fs = require("fs");
const utils_1 = require("../utils");
const deviceType_1 = require("../../enums/deviceType");
const analytics_1 = require("../../misc/analytics");
class ElectronPlatformUtilsService {
    constructor(i18nService, messagingService, isDesktopApp) {
        this.i18nService = i18nService;
        this.messagingService = messagingService;
        this.isDesktopApp = isDesktopApp;
        this.deviceCache = null;
        this.analyticsIdCache = null;
        this.identityClientId = isDesktopApp ? 'desktop' : 'connector';
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
        return true;
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
        return utils_1.isMacAppStore();
    }
    analyticsId() {
        if (!this.isDesktopApp) {
            return null;
        }
        if (this.analyticsIdCache) {
            return this.analyticsIdCache;
        }
        this.analyticsIdCache = analytics_1.AnalyticsIds[this.getDevice()];
        return this.analyticsIdCache;
    }
    isViewOpen() {
        return false;
    }
    lockTimeout() {
        return null;
    }
    launchUri(uri, options) {
        electron_1.shell.openExternal(uri);
    }
    saveFile(win, blobData, blobOptions, fileName) {
        electron_1.remote.dialog.showSaveDialog(electron_1.remote.getCurrentWindow(), {
            defaultPath: fileName,
            showsTagField: false,
        }, (path) => {
            if (path != null) {
                fs.writeFile(path, Buffer.from(blobData), (err) => {
                    // error check?
                });
            }
        });
    }
    getApplicationVersion() {
        return electron_1.remote.app.getVersion();
    }
    supportsU2f(win) {
        // Not supported in Electron at this time.
        // ref: https://github.com/electron/electron/issues/3226
        return false;
    }
    supportsDuo() {
        return true;
    }
    showToast(type, title, text, options) {
        this.messagingService.send('showToast', {
            text: text,
            title: title,
            type: type,
            options: options,
        });
    }
    showDialog(text, title, confirmText, cancelText, type) {
        const buttons = [confirmText == null ? this.i18nService.t('ok') : confirmText];
        if (cancelText != null) {
            buttons.push(cancelText);
        }
        const result = electron_1.remote.dialog.showMessageBox(electron_1.remote.getCurrentWindow(), {
            type: type,
            title: title,
            message: title,
            detail: text,
            buttons: buttons,
            cancelId: buttons.length === 2 ? 1 : null,
            defaultId: 0,
            noLink: true,
        });
        return Promise.resolve(result === 0);
    }
    eventTrack(action, label, options) {
        this.messagingService.send('analyticsEventTrack', {
            action: action,
            label: label,
            options: options,
        });
    }
    isDev() {
        return utils_1.isDev();
    }
    isSelfHost() {
        return false;
    }
    copyToClipboard(text, options) {
        const type = options ? options.type : null;
        const clearing = options ? !!options.clearing : false;
        const clearMs = options && options.clearMs ? options.clearMs : null;
        electron_1.clipboard.writeText(text, type);
        if (!clearing) {
            this.messagingService.send('copiedToClipboard', {
                clipboardValue: text,
                clearMs: clearMs,
                type: type,
                clearing: clearing,
            });
        }
    }
    readFromClipboard(options) {
        const type = options ? options.type : null;
        return Promise.resolve(electron_1.clipboard.readText(type));
    }
}
exports.ElectronPlatformUtilsService = ElectronPlatformUtilsService;
//# sourceMappingURL=electronPlatformUtils.service.js.map