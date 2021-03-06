import { DeviceType } from '../../enums/deviceType';
import { I18nService } from '../../abstractions/i18n.service';
import { MessagingService } from '../../abstractions/messaging.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
export declare class ElectronPlatformUtilsService implements PlatformUtilsService {
    private i18nService;
    private messagingService;
    private isDesktopApp;
    identityClientId: string;
    private deviceCache;
    private analyticsIdCache;
    constructor(i18nService: I18nService, messagingService: MessagingService, isDesktopApp: boolean);
    getDevice(): DeviceType;
    getDeviceString(): string;
    isFirefox(): boolean;
    isChrome(): boolean;
    isEdge(): boolean;
    isOpera(): boolean;
    isVivaldi(): boolean;
    isSafari(): boolean;
    isIE(): boolean;
    isMacAppStore(): boolean;
    analyticsId(): string;
    isViewOpen(): boolean;
    lockTimeout(): number;
    launchUri(uri: string, options?: any): void;
    saveFile(win: Window, blobData: any, blobOptions: any, fileName: string): void;
    getApplicationVersion(): string;
    supportsU2f(win: Window): boolean;
    supportsDuo(): boolean;
    showToast(type: 'error' | 'success' | 'warning' | 'info', title: string, text: string | string[], options?: any): void;
    showDialog(text: string, title?: string, confirmText?: string, cancelText?: string, type?: string): Promise<boolean>;
    eventTrack(action: string, label?: string, options?: any): void;
    isDev(): boolean;
    isSelfHost(): boolean;
    copyToClipboard(text: string, options?: any): void;
    readFromClipboard(options?: any): Promise<string>;
}
