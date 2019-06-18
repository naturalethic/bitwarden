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
const electronConstants_1 = require("./electronConstants");
const path = require("path");
const url = require("url");
const utils_1 = require("./utils");
const WindowEventHandlingDelay = 100;
const Keys = {
    mainWindowSize: 'mainWindowSize',
};
class WindowMain {
    constructor(storageService, hideTitleBar = false, defaultWidth = 950, defaultHeight = 600) {
        this.storageService = storageService;
        this.hideTitleBar = hideTitleBar;
        this.defaultWidth = defaultWidth;
        this.defaultHeight = defaultHeight;
        this.isQuitting = false;
        this.windowStates = {};
        this.enableAlwaysOnTop = false;
    }
    init() {
        return new Promise((resolve, reject) => {
            try {
                if (!utils_1.isMacAppStore() && !utils_1.isSnapStore()) {
                    const gotTheLock = electron_1.app.requestSingleInstanceLock();
                    if (!gotTheLock) {
                        electron_1.app.quit();
                        return;
                    }
                    else {
                        electron_1.app.on('second-instance', (event, commandLine, workingDirectory) => {
                            // Someone tried to run a second instance, we should focus our window.
                            if (this.win != null) {
                                if (this.win.isMinimized()) {
                                    this.win.restore();
                                }
                                this.win.focus();
                            }
                        });
                    }
                }
                // This method will be called when Electron is shutting
                // down the application.
                electron_1.app.on('before-quit', () => {
                    this.isQuitting = true;
                });
                // This method will be called when Electron has finished
                // initialization and is ready to create browser windows.
                // Some APIs can only be used after this event occurs.
                electron_1.app.on('ready', () => __awaiter(this, void 0, void 0, function* () {
                    yield this.createWindow();
                    resolve();
                }));
                // Quit when all windows are closed.
                electron_1.app.on('window-all-closed', () => {
                    // On OS X it is common for applications and their menu bar
                    // to stay active until the user quits explicitly with Cmd + Q
                    if (process.platform !== 'darwin' || utils_1.isMacAppStore()) {
                        electron_1.app.quit();
                    }
                });
                electron_1.app.on('activate', () => __awaiter(this, void 0, void 0, function* () {
                    // On OS X it's common to re-create a window in the app when the
                    // dock icon is clicked and there are no other windows open.
                    if (this.win === null) {
                        yield this.createWindow();
                    }
                }));
            }
            catch (e) {
                // Catch Error
                // throw e;
                reject(e);
            }
        });
    }
    createWindow() {
        return __awaiter(this, void 0, void 0, function* () {
            this.windowStates[Keys.mainWindowSize] = yield this.getWindowState(Keys.mainWindowSize, this.defaultWidth, this.defaultHeight);
            this.enableAlwaysOnTop = yield this.storageService.get(electronConstants_1.ElectronConstants.enableAlwaysOnTopKey);
            // Create the browser window.
            this.win = new electron_1.BrowserWindow({
                width: this.windowStates[Keys.mainWindowSize].width,
                height: this.windowStates[Keys.mainWindowSize].height,
                minWidth: 680,
                minHeight: 500,
                x: this.windowStates[Keys.mainWindowSize].x,
                y: this.windowStates[Keys.mainWindowSize].y,
                title: electron_1.app.getName(),
                icon: process.platform === 'linux' ? path.join(__dirname, '/images/icon.png') : undefined,
                titleBarStyle: this.hideTitleBar && process.platform === 'darwin' ? 'hiddenInset' : undefined,
                show: false,
                alwaysOnTop: this.enableAlwaysOnTop,
            });
            if (this.windowStates[Keys.mainWindowSize].isMaximized) {
                this.win.maximize();
            }
            // Show it later since it might need to be maximized.
            this.win.show();
            // and load the index.html of the app.
            this.win.loadURL(url.format({
                protocol: 'file:',
                pathname: path.join(__dirname, '/index.html'),
                slashes: true,
            }));
            // Open the DevTools.
            if (utils_1.isDev()) {
                this.win.webContents.openDevTools();
            }
            // Emitted when the window is closed.
            this.win.on('closed', () => __awaiter(this, void 0, void 0, function* () {
                yield this.updateWindowState(Keys.mainWindowSize, this.win);
                // Dereference the window object, usually you would store window
                // in an array if your app supports multi windows, this is the time
                // when you should delete the corresponding element.
                this.win = null;
            }));
            this.win.on('close', () => __awaiter(this, void 0, void 0, function* () {
                yield this.updateWindowState(Keys.mainWindowSize, this.win);
            }));
            this.win.on('maximize', () => __awaiter(this, void 0, void 0, function* () {
                yield this.updateWindowState(Keys.mainWindowSize, this.win);
            }));
            this.win.on('unmaximize', () => __awaiter(this, void 0, void 0, function* () {
                yield this.updateWindowState(Keys.mainWindowSize, this.win);
            }));
            this.win.on('resize', () => {
                this.windowStateChangeHandler(Keys.mainWindowSize, this.win);
            });
            this.win.on('move', () => {
                this.windowStateChangeHandler(Keys.mainWindowSize, this.win);
            });
        });
    }
    toggleAlwaysOnTop() {
        return __awaiter(this, void 0, void 0, function* () {
            this.enableAlwaysOnTop = !this.win.isAlwaysOnTop();
            this.win.setAlwaysOnTop(this.enableAlwaysOnTop);
            yield this.storageService.save(electronConstants_1.ElectronConstants.enableAlwaysOnTopKey, this.enableAlwaysOnTop);
        });
    }
    windowStateChangeHandler(configKey, win) {
        global.clearTimeout(this.windowStateChangeTimer);
        this.windowStateChangeTimer = global.setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            yield this.updateWindowState(configKey, win);
        }), WindowEventHandlingDelay);
    }
    updateWindowState(configKey, win) {
        return __awaiter(this, void 0, void 0, function* () {
            if (win == null) {
                return;
            }
            try {
                const bounds = win.getBounds();
                if (this.windowStates[configKey] == null) {
                    this.windowStates[configKey] = yield this.storageService.get(configKey);
                    if (this.windowStates[configKey] == null) {
                        this.windowStates[configKey] = {};
                    }
                }
                this.windowStates[configKey].isMaximized = win.isMaximized();
                this.windowStates[configKey].displayBounds = electron_1.screen.getDisplayMatching(bounds).bounds;
                if (!win.isMaximized() && !win.isMinimized() && !win.isFullScreen()) {
                    this.windowStates[configKey].x = bounds.x;
                    this.windowStates[configKey].y = bounds.y;
                    this.windowStates[configKey].width = bounds.width;
                    this.windowStates[configKey].height = bounds.height;
                }
                yield this.storageService.save(configKey, this.windowStates[configKey]);
            }
            catch (e) { }
        });
    }
    getWindowState(configKey, defaultWidth, defaultHeight) {
        return __awaiter(this, void 0, void 0, function* () {
            let state = yield this.storageService.get(configKey);
            const isValid = state != null && (this.stateHasBounds(state) || state.isMaximized);
            let displayBounds = null;
            if (!isValid) {
                state = {
                    width: defaultWidth,
                    height: defaultHeight,
                };
                displayBounds = electron_1.screen.getPrimaryDisplay().bounds;
            }
            else if (this.stateHasBounds(state) && state.displayBounds) {
                // Check if the display where the window was last open is still available
                displayBounds = electron_1.screen.getDisplayMatching(state.displayBounds).bounds;
                if (displayBounds.width !== state.displayBounds.width ||
                    displayBounds.height !== state.displayBounds.height ||
                    displayBounds.x !== state.displayBounds.x ||
                    displayBounds.y !== state.displayBounds.y) {
                    state.x = undefined;
                    state.y = undefined;
                    displayBounds = electron_1.screen.getPrimaryDisplay().bounds;
                }
            }
            if (displayBounds != null) {
                if (state.width > displayBounds.width && state.height > displayBounds.height) {
                    state.isMaximized = true;
                }
                if (state.width > displayBounds.width) {
                    state.width = displayBounds.width - 10;
                }
                if (state.height > displayBounds.height) {
                    state.height = displayBounds.height - 10;
                }
            }
            return state;
        });
    }
    stateHasBounds(state) {
        return state != null && Number.isInteger(state.x) && Number.isInteger(state.y) &&
            Number.isInteger(state.width) && state.width > 0 && Number.isInteger(state.height) && state.height > 0;
    }
}
exports.WindowMain = WindowMain;
//# sourceMappingURL=window.main.js.map