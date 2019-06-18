import { AppIdService } from '../abstractions/appId.service';
import { PlatformUtilsService } from '../abstractions/platformUtils.service';
import { StorageService } from '../abstractions/storage.service';
import { DeviceType } from '../enums/deviceType';
export declare const AnalyticsIds: {
    [DeviceType.ChromeExtension]: string;
    [DeviceType.FirefoxExtension]: string;
    [DeviceType.OperaExtension]: string;
    [DeviceType.EdgeExtension]: string;
    [DeviceType.VivaldiExtension]: string;
    [DeviceType.SafariExtension]: string;
    [DeviceType.WindowsDesktop]: string;
    [DeviceType.LinuxDesktop]: string;
    [DeviceType.MacOsDesktop]: string;
};
export declare class Analytics {
    private gaFilter?;
    private platformUtilsService?;
    private storageService?;
    private appIdService?;
    private dependencyResolver?;
    private gaTrackingId;
    private defaultDisabled;
    private appVersion;
    constructor(win: Window, gaFilter?: () => boolean, platformUtilsService?: PlatformUtilsService, storageService?: StorageService, appIdService?: AppIdService, dependencyResolver?: () => any);
    ga(action: string, param1: any, param2?: any): Promise<void>;
    private gaTrackEvent;
    private gaTrackPageView;
    private cleanPagePath;
}
