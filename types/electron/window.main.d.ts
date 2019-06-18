import { BrowserWindow } from 'electron';
import { StorageService } from '../abstractions/storage.service';
export declare class WindowMain {
    private storageService;
    private hideTitleBar;
    private defaultWidth;
    private defaultHeight;
    win: BrowserWindow;
    isQuitting: boolean;
    private windowStateChangeTimer;
    private windowStates;
    private enableAlwaysOnTop;
    constructor(storageService: StorageService, hideTitleBar?: boolean, defaultWidth?: number, defaultHeight?: number);
    init(): Promise<any>;
    createWindow(): Promise<void>;
    toggleAlwaysOnTop(): Promise<void>;
    private windowStateChangeHandler;
    private updateWindowState;
    private getWindowState;
    private stateHasBounds;
}
