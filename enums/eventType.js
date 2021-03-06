"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventType;
(function (EventType) {
    EventType[EventType["User_LoggedIn"] = 1000] = "User_LoggedIn";
    EventType[EventType["User_ChangedPassword"] = 1001] = "User_ChangedPassword";
    EventType[EventType["User_Updated2fa"] = 1002] = "User_Updated2fa";
    EventType[EventType["User_Disabled2fa"] = 1003] = "User_Disabled2fa";
    EventType[EventType["User_Recovered2fa"] = 1004] = "User_Recovered2fa";
    EventType[EventType["User_FailedLogIn"] = 1005] = "User_FailedLogIn";
    EventType[EventType["User_FailedLogIn2fa"] = 1006] = "User_FailedLogIn2fa";
    EventType[EventType["Cipher_Created"] = 1100] = "Cipher_Created";
    EventType[EventType["Cipher_Updated"] = 1101] = "Cipher_Updated";
    EventType[EventType["Cipher_Deleted"] = 1102] = "Cipher_Deleted";
    EventType[EventType["Cipher_AttachmentCreated"] = 1103] = "Cipher_AttachmentCreated";
    EventType[EventType["Cipher_AttachmentDeleted"] = 1104] = "Cipher_AttachmentDeleted";
    EventType[EventType["Cipher_Shared"] = 1105] = "Cipher_Shared";
    EventType[EventType["Cipher_UpdatedCollections"] = 1106] = "Cipher_UpdatedCollections";
    EventType[EventType["Collection_Created"] = 1300] = "Collection_Created";
    EventType[EventType["Collection_Updated"] = 1301] = "Collection_Updated";
    EventType[EventType["Collection_Deleted"] = 1302] = "Collection_Deleted";
    EventType[EventType["Group_Created"] = 1400] = "Group_Created";
    EventType[EventType["Group_Updated"] = 1401] = "Group_Updated";
    EventType[EventType["Group_Deleted"] = 1402] = "Group_Deleted";
    EventType[EventType["OrganizationUser_Invited"] = 1500] = "OrganizationUser_Invited";
    EventType[EventType["OrganizationUser_Confirmed"] = 1501] = "OrganizationUser_Confirmed";
    EventType[EventType["OrganizationUser_Updated"] = 1502] = "OrganizationUser_Updated";
    EventType[EventType["OrganizationUser_Removed"] = 1503] = "OrganizationUser_Removed";
    EventType[EventType["OrganizationUser_UpdatedGroups"] = 1504] = "OrganizationUser_UpdatedGroups";
    EventType[EventType["Organization_Updated"] = 1600] = "Organization_Updated";
    EventType[EventType["Organization_PurgedVault"] = 1601] = "Organization_PurgedVault";
})(EventType = exports.EventType || (exports.EventType = {}));
//# sourceMappingURL=eventType.js.map