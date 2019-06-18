"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
const notificationType_1 = require("../../enums/notificationType");
class NotificationResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.contextId = this.getResponseProperty('ContextId');
        this.type = this.getResponseProperty('Type');
        const payload = this.getResponseProperty('Payload');
        switch (this.type) {
            case notificationType_1.NotificationType.SyncCipherCreate:
            case notificationType_1.NotificationType.SyncCipherDelete:
            case notificationType_1.NotificationType.SyncCipherUpdate:
            case notificationType_1.NotificationType.SyncLoginDelete:
                this.payload = new SyncCipherNotification(payload);
                break;
            case notificationType_1.NotificationType.SyncFolderCreate:
            case notificationType_1.NotificationType.SyncFolderDelete:
            case notificationType_1.NotificationType.SyncFolderUpdate:
                this.payload = new SyncFolderNotification(payload);
                break;
            case notificationType_1.NotificationType.SyncVault:
            case notificationType_1.NotificationType.SyncCiphers:
            case notificationType_1.NotificationType.SyncOrgKeys:
            case notificationType_1.NotificationType.SyncSettings:
            case notificationType_1.NotificationType.LogOut:
                this.payload = new UserNotification(payload);
                break;
            default:
                break;
        }
    }
}
exports.NotificationResponse = NotificationResponse;
class SyncCipherNotification extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty('Id');
        this.userId = this.getResponseProperty('UserId');
        this.organizationId = this.getResponseProperty('OrganizationId');
        this.collectionIds = this.getResponseProperty('CollectionIds');
        this.revisionDate = new Date(this.getResponseProperty('RevisionDate'));
    }
}
exports.SyncCipherNotification = SyncCipherNotification;
class SyncFolderNotification extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty('Id');
        this.userId = this.getResponseProperty('UserId');
        this.revisionDate = new Date(this.getResponseProperty('RevisionDate'));
    }
}
exports.SyncFolderNotification = SyncFolderNotification;
class UserNotification extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.userId = this.getResponseProperty('UserId');
        this.date = new Date(this.getResponseProperty('Date'));
    }
}
exports.UserNotification = UserNotification;
//# sourceMappingURL=notificationResponse.js.map