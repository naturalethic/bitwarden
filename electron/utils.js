"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isDev() {
    // ref: https://github.com/sindresorhus/electron-is-dev
    if ('ELECTRON_IS_DEV' in process.env) {
        return parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
    }
    return (process.defaultApp || /node_modules[\\/]electron[\\/]/.test(process.execPath));
}
exports.isDev = isDev;
function isAppImage() {
    return process.platform === 'linux' && 'APPIMAGE' in process.env;
}
exports.isAppImage = isAppImage;
function isMacAppStore() {
    return process.platform === 'darwin' && process.mas && process.mas === true;
}
exports.isMacAppStore = isMacAppStore;
function isWindowsStore() {
    return process.platform === 'win32' && process.windowsStore && process.windowsStore === true;
}
exports.isWindowsStore = isWindowsStore;
function isSnapStore() {
    return process.platform === 'linux' && process.env.SNAP_USER_DATA != null;
}
exports.isSnapStore = isSnapStore;
function isWindowsPortable() {
    return process.platform === 'win32' && process.env.PORTABLE_EXECUTABLE_DIR != null;
}
exports.isWindowsPortable = isWindowsPortable;
//# sourceMappingURL=utils.js.map