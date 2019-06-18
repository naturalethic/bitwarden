import { MenuItemConstructorOptions } from 'electron';
import { I18nService } from '../abstractions/i18n.service';
import { WindowMain } from './window.main';
export declare class BaseMenu {
    protected i18nService: I18nService;
    protected windowMain: WindowMain;
    protected editMenuItemOptions: MenuItemConstructorOptions;
    protected viewSubMenuItemOptions: MenuItemConstructorOptions[];
    protected windowMenuItemOptions: MenuItemConstructorOptions;
    protected macAppMenuItemOptions: MenuItemConstructorOptions[];
    protected macWindowSubmenuOptions: MenuItemConstructorOptions[];
    constructor(i18nService: I18nService, windowMain: WindowMain);
    protected initProperties(): void;
    protected initContextMenu(): void;
}
