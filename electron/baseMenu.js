"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const utils_1 = require("./utils");
class BaseMenu {
    constructor(i18nService, windowMain) {
        this.i18nService = i18nService;
        this.windowMain = windowMain;
    }
    initProperties() {
        this.editMenuItemOptions = {
            label: this.i18nService.t('edit'),
            submenu: [
                {
                    label: this.i18nService.t('undo'),
                    role: 'undo',
                },
                {
                    label: this.i18nService.t('redo'),
                    role: 'redo',
                },
                { type: 'separator' },
                {
                    label: this.i18nService.t('cut'),
                    role: 'cut',
                },
                {
                    label: this.i18nService.t('copy'),
                    role: 'copy',
                },
                {
                    label: this.i18nService.t('paste'),
                    role: 'paste',
                },
                { type: 'separator' },
                {
                    label: this.i18nService.t('selectAll'),
                    role: 'selectall',
                },
            ],
        };
        this.viewSubMenuItemOptions = [
            {
                label: this.i18nService.t('zoomIn'),
                role: 'zoomin', accelerator: 'CmdOrCtrl+=',
            },
            {
                label: this.i18nService.t('zoomOut'),
                role: 'zoomout', accelerator: 'CmdOrCtrl+-',
            },
            {
                label: this.i18nService.t('resetZoom'),
                role: 'resetzoom', accelerator: 'CmdOrCtrl+0',
            },
            { type: 'separator' },
            {
                label: this.i18nService.t('toggleFullScreen'),
                role: 'togglefullscreen',
            },
            { type: 'separator' },
            {
                label: this.i18nService.t('reload'),
                role: 'forcereload',
            },
            {
                label: this.i18nService.t('toggleDevTools'),
                role: 'toggledevtools',
                accelerator: 'F12',
            },
        ];
        this.windowMenuItemOptions = {
            label: this.i18nService.t('window'),
            role: 'window',
            submenu: [
                {
                    label: this.i18nService.t('minimize'),
                    role: 'minimize',
                },
                {
                    label: this.i18nService.t('close'),
                    role: 'close',
                },
            ],
        };
        if (process.platform === 'darwin') {
            this.macAppMenuItemOptions = [
                {
                    label: this.i18nService.t('services'),
                    role: 'services', submenu: [],
                },
                { type: 'separator' },
                {
                    label: this.i18nService.t('hideBitwarden'),
                    role: 'hide',
                },
                {
                    label: this.i18nService.t('hideOthers'),
                    role: 'hideothers',
                },
                {
                    label: this.i18nService.t('showAll'),
                    role: 'unhide',
                },
                { type: 'separator' },
                {
                    label: this.i18nService.t('quitBitwarden'),
                    role: 'quit',
                },
            ];
            this.macWindowSubmenuOptions = [
                {
                    label: this.i18nService.t('minimize'),
                    role: 'minimize',
                },
                {
                    label: this.i18nService.t('zoom'),
                    role: 'zoom',
                },
                { type: 'separator' },
                {
                    label: this.i18nService.t('bringAllToFront'),
                    role: 'front',
                },
                {
                    label: this.i18nService.t('close'),
                    role: utils_1.isMacAppStore() ? 'quit' : 'close',
                },
            ];
        }
    }
    initContextMenu() {
        if (this.windowMain.win == null) {
            return;
        }
        const selectionMenu = electron_1.Menu.buildFromTemplate([
            {
                label: this.i18nService.t('copy'),
                role: 'copy',
            },
            { type: 'separator' },
            {
                label: this.i18nService.t('selectAll'),
                role: 'selectall',
            },
        ]);
        const inputMenu = electron_1.Menu.buildFromTemplate([
            {
                label: this.i18nService.t('undo'),
                role: 'undo',
            },
            {
                label: this.i18nService.t('redo'),
                role: 'redo',
            },
            { type: 'separator' },
            {
                label: this.i18nService.t('cut'),
                role: 'cut',
                enabled: false,
            },
            {
                label: this.i18nService.t('copy'),
                role: 'copy',
                enabled: false,
            },
            {
                label: this.i18nService.t('paste'),
                role: 'paste',
            },
            { type: 'separator' },
            {
                label: this.i18nService.t('selectAll'),
                role: 'selectall',
            },
        ]);
        const inputSelectionMenu = electron_1.Menu.buildFromTemplate([
            {
                label: this.i18nService.t('cut'),
                role: 'cut',
            },
            {
                label: this.i18nService.t('copy'),
                role: 'copy',
            },
            {
                label: this.i18nService.t('paste'),
                role: 'paste',
            },
            { type: 'separator' },
            {
                label: this.i18nService.t('selectAll'),
                role: 'selectall',
            },
        ]);
        this.windowMain.win.webContents.on('context-menu', (e, props) => {
            const selected = props.selectionText && props.selectionText.trim() !== '';
            if (props.isEditable && selected) {
                inputSelectionMenu.popup({ window: this.windowMain.win });
            }
            else if (props.isEditable) {
                inputMenu.popup({ window: this.windowMain.win });
            }
            else if (selected) {
                selectionMenu.popup({ window: this.windowMain.win });
            }
        });
    }
}
exports.BaseMenu = BaseMenu;
//# sourceMappingURL=baseMenu.js.map