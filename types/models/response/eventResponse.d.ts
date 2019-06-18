import { BaseResponse } from './baseResponse';
import { DeviceType } from '../../enums/deviceType';
import { EventType } from '../../enums/eventType';
export declare class EventResponse extends BaseResponse {
    type: EventType;
    userId: string;
    organizationId: string;
    cipherId: string;
    collectionId: string;
    groupId: string;
    organizationUserId: string;
    actingUserId: string;
    date: string;
    deviceType: DeviceType;
    ipAddress: string;
    constructor(response: any);
}
