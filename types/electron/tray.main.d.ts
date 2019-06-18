import { Menu, MenuItemConstructorOptions } from 'electron';
import { I18nService } from '../abstractions/i18n.service';
import { StorageService } from '../abstractions/storage.service';
import { WindowMain } from './window.main';
export declare class TrayMain {
    private windowMain;
    private i18nService;
    private storageService;
    contextMenu: Menu;
    private appName;
    private tray;
    private icon;
    private pressedIcon;
    constructor(windowMain: WindowMain, i18nService: I18nService, storageService: StorageService);
    init(appName: string, additionalMenuItems?: MenuItemConstructorOptions[]): Promise<void>;
    removeTray(showWindow?: boolean): void;
    hideToTray(): void;
    showTray(): void;
    private toggleWindow;
    private closeWindow;
}
