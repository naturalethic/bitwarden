import { DeviceType } from '../../enums/deviceType';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
export declare class DeviceRequest {
    type: DeviceType;
    name: string;
    identifier: string;
    pushToken?: string;
    constructor(appId: string, platformUtilsService: PlatformUtilsService);
}
