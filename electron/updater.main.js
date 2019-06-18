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
const electron_1 = require("electron");
const electron_log_1 = require("electron-log");
const electron_updater_1 = require("electron-updater");
const utils_1 = require("./utils");
const UpdaterCheckInitalDelay = 5 * 1000; // 5 seconds
const UpdaterCheckInterval = 12 * 60 * 60 * 1000; // 12 hours
class UpdaterMain {
    constructor(i18nService, windowMain, gitHubProject, onCheckingForUpdate = null, onReset = null, onUpdateDownloaded = null, projectName) {
        this.i18nService = i18nService;
        this.windowMain = windowMain;
        this.gitHubProject = gitHubProject;
        this.onCheckingForUpdate = onCheckingForUpdate;
        this.onReset = onReset;
        this.onUpdateDownloaded = onUpdateDownloaded;
        this.projectName = projectName;
        this.doingUpdateCheck = false;
        this.doingUpdateCheckWithFeedback = false;
        this.canUpdate = false;
        electron_updater_1.autoUpdater.logger = electron_log_1.default;
        const linuxCanUpdate = process.platform === 'linux' && utils_1.isAppImage();
        const windowsCanUpdate = process.platform === 'win32' && !utils_1.isWindowsStore() && !utils_1.isWindowsPortable();
        const macCanUpdate = process.platform === 'darwin' && !utils_1.isMacAppStore();
        this.canUpdate = process.env.ELECTRON_NO_UPDATER !== '1' &&
            (linuxCanUpdate || windowsCanUpdate || macCanUpdate);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            global.setTimeout(() => __awaiter(this, void 0, void 0, function* () { return yield this.checkForUpdate(); }), UpdaterCheckInitalDelay);
            global.setInterval(() => __awaiter(this, void 0, void 0, function* () { return yield this.checkForUpdate(); }), UpdaterCheckInterval);
            electron_updater_1.autoUpdater.on('checking-for-update', () => {
                if (this.onCheckingForUpdate != null) {
                    this.onCheckingForUpdate();
                }
                this.doingUpdateCheck = true;
            });
            electron_updater_1.autoUpdater.on('update-available', () => {
                if (this.doingUpdateCheckWithFeedback) {
                    if (this.windowMain.win == null) {
                        this.reset();
                        return;
                    }
                    const result = electron_1.dialog.showMessageBox(this.windowMain.win, {
                        type: 'info',
                        title: this.i18nService.t(this.projectName) + ' - ' + this.i18nService.t('updateAvailable'),
                        message: this.i18nService.t('updateAvailable'),
                        detail: this.i18nService.t('updateAvailableDesc'),
                        buttons: [this.i18nService.t('yes'), this.i18nService.t('no')],
                        cancelId: 1,
                        defaultId: 0,
                        noLink: true,
                    });
                    if (result === 0) {
                        electron_updater_1.autoUpdater.downloadUpdate();
                    }
                    else {
                        this.reset();
                    }
                }
            });
            electron_updater_1.autoUpdater.on('update-not-available', () => {
                if (this.doingUpdateCheckWithFeedback && this.windowMain.win != null) {
                    electron_1.dialog.showMessageBox(this.windowMain.win, {
                        message: this.i18nService.t('noUpdatesAvailable'),
                        buttons: [this.i18nService.t('ok')],
                        defaultId: 0,
                        noLink: true,
                    });
                }
                this.reset();
            });
            electron_updater_1.autoUpdater.on('update-downloaded', (info) => {
                if (this.onUpdateDownloaded != null) {
                    this.onUpdateDownloaded();
                }
                if (this.windowMain.win == null) {
                    return;
                }
                const result = electron_1.dialog.showMessageBox(this.windowMain.win, {
                    type: 'info',
                    title: this.i18nService.t(this.projectName) + ' - ' + this.i18nService.t('restartToUpdate'),
                    message: this.i18nService.t('restartToUpdate'),
                    detail: this.i18nService.t('restartToUpdateDesc', info.version),
                    buttons: [this.i18nService.t('restart'), this.i18nService.t('later')],
                    cancelId: 1,
                    defaultId: 0,
                    noLink: true,
                });
                if (result === 0) {
                    electron_updater_1.autoUpdater.quitAndInstall(false, true);
                }
            });
            electron_updater_1.autoUpdater.on('error', (error) => {
                if (this.doingUpdateCheckWithFeedback) {
                    electron_1.dialog.showErrorBox(this.i18nService.t('updateError'), error == null ? this.i18nService.t('unknown') : (error.stack || error).toString());
                }
                this.reset();
            });
        });
    }
    checkForUpdate(withFeedback = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.doingUpdateCheck || utils_1.isDev()) {
                return;
            }
            if (!this.canUpdate) {
                if (withFeedback) {
                    electron_1.shell.openExternal('https://github.com/bitwarden/' + this.gitHubProject + '/releases');
                }
                return;
            }
            this.doingUpdateCheckWithFeedback = withFeedback;
            if (withFeedback) {
                electron_updater_1.autoUpdater.autoDownload = false;
            }
            yield electron_updater_1.autoUpdater.checkForUpdates();
        });
    }
    reset() {
        if (this.onReset != null) {
            this.onReset();
        }
        electron_updater_1.autoUpdater.autoDownload = true;
        this.doingUpdateCheck = false;
    }
}
exports.UpdaterMain = UpdaterMain;
//# sourceMappingURL=updater.main.js.map