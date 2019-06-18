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
const path = require("path");
const electronConstants_1 = require("./electronConstants");
class TrayMain {
    constructor(windowMain, i18nService, storageService) {
        this.windowMain = windowMain;
        this.i18nService = i18nService;
        this.storageService = storageService;
        if (process.platform === 'win32') {
            this.icon = path.join(__dirname, '/images/icon.ico');
        }
        else if (process.platform === 'darwin') {
            const nImage = electron_1.nativeImage.createFromPath(path.join(__dirname, '/images/icon-template.png'));
            nImage.setTemplateImage(true);
            this.icon = nImage;
            this.pressedIcon = electron_1.nativeImage.createFromPath(path.join(__dirname, '/images/icon-highlight.png'));
        }
        else {
            this.icon = path.join(__dirname, '/images/icon.png');
        }
    }
    init(appName, additionalMenuItems = null) {
        return __awaiter(this, void 0, void 0, function* () {
            this.appName = appName;
            const menuItemOptions = [{
                    label: this.i18nService.t('showHide'),
                    click: () => this.toggleWindow(),
                },
                { type: 'separator' },
                {
                    label: process.platform === 'darwin' ? this.i18nService.t('close') : this.i18nService.t('exit'),
                    click: () => this.closeWindow(),
                }];
            if (additionalMenuItems != null) {
                menuItemOptions.splice(1, 0, ...additionalMenuItems);
            }
            if (process.platform !== 'darwin') {
                this.contextMenu = electron_1.Menu.buildFromTemplate(menuItemOptions);
            }
            if (yield this.storageService.get(electronConstants_1.ElectronConstants.enableTrayKey)) {
                this.showTray();
            }
            if (process.platform === 'win32') {
                this.windowMain.win.on('minimize', (e) => __awaiter(this, void 0, void 0, function* () {
                    if (yield this.storageService.get(electronConstants_1.ElectronConstants.enableMinimizeToTrayKey)) {
                        e.preventDefault();
                        this.hideToTray();
                    }
                }));
                this.windowMain.win.on('close', (e) => __awaiter(this, void 0, void 0, function* () {
                    if (yield this.storageService.get(electronConstants_1.ElectronConstants.enableCloseToTrayKey)) {
                        if (!this.windowMain.isQuitting) {
                            e.preventDefault();
                            this.hideToTray();
                        }
                    }
                }));
            }
            this.windowMain.win.on('show', (e) => __awaiter(this, void 0, void 0, function* () {
                const enableTray = yield this.storageService.get(electronConstants_1.ElectronConstants.enableTrayKey);
                if (!enableTray) {
                    this.removeTray(false);
                }
            }));
        });
    }
    removeTray(showWindow = true) {
        if (this.tray != null) {
            this.tray.destroy();
            this.tray = null;
        }
        if (showWindow && this.windowMain.win != null && !this.windowMain.win.isVisible()) {
            this.windowMain.win.show();
        }
    }
    hideToTray() {
        this.showTray();
        if (this.windowMain.win != null) {
            this.windowMain.win.hide();
        }
    }
    showTray() {
        if (this.tray != null) {
            return;
        }
        this.tray = new electron_1.Tray(this.icon);
        this.tray.setToolTip(this.appName);
        this.tray.on('click', () => this.toggleWindow());
        if (this.pressedIcon != null) {
            this.tray.setPressedImage(this.pressedIcon);
        }
        if (this.contextMenu != null) {
            this.tray.setContextMenu(this.contextMenu);
        }
    }
    toggleWindow() {
        if (this.windowMain.win == null) {
            if (process.platform === 'darwin') {
                // On MacOS, closing the window via the red button destroys the BrowserWindow instance.
                this.windowMain.createWindow().then(() => {
                    this.windowMain.win.show();
                });
            }
            return;
        }
        if (this.windowMain.win.isVisible()) {
            this.windowMain.win.hide();
        }
        else {
            this.windowMain.win.show();
        }
    }
    closeWindow() {
        this.windowMain.isQuitting = true;
        if (this.windowMain.win != null) {
            this.windowMain.win.close();
        }
    }
}
exports.TrayMain = TrayMain;
//# sourceMappingURL=tray.main.js.map