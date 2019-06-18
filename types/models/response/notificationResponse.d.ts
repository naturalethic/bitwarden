import { BaseResponse } from './baseResponse';
import { NotificationType } from '../../enums/notificationType';
export declare class NotificationResponse extends BaseResponse {
    contextId: string;
    type: NotificationType;
    payload: any;
    constructor(response: any);
}
export declare class SyncCipherNotification extends BaseResponse {
    id: string;
    userId: string;
    organizationId: string;
    collectionIds: string[];
    revisionDate: Date;
    constructor(response: any);
}
export declare class SyncFolderNotification extends BaseResponse {
    id: string;
    userId: string;
    revisionDate: Date;
    constructor(response: any);
}
export declare class UserNotification extends BaseResponse {
    userId: string;
    date: Date;
    constructor(response: any);
}
