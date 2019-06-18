import { BaseResponse } from './baseResponse';
import { DeviceType } from '../../enums/deviceType';
export declare class DeviceResponse extends BaseResponse {
    id: string;
    name: number;
    identifier: string;
    type: DeviceType;
    creationDate: string;
    constructor(response: any);
}
