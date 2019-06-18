"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const organizationUserStatusType_1 = require("../../enums/organizationUserStatusType");
const organizationUserType_1 = require("../../enums/organizationUserType");
class Organization {
    constructor(obj) {
        if (obj == null) {
            return;
        }
        this.id = obj.id;
        this.name = obj.name;
        this.status = obj.status;
        this.type = obj.type;
        this.enabled = obj.enabled;
        this.useGroups = obj.useGroups;
        this.useDirectory = obj.useDirectory;
        this.useEvents = obj.useEvents;
        this.useTotp = obj.useTotp;
        this.use2fa = obj.use2fa;
        this.useApi = obj.useApi;
        this.selfHost = obj.selfHost;
        this.usersGetPremium = obj.usersGetPremium;
        this.seats = obj.seats;
        this.maxCollections = obj.maxCollections;
        this.maxStorageGb = obj.maxStorageGb;
    }
    get canAccess() {
        if (this.type === organizationUserType_1.OrganizationUserType.Owner) {
            return true;
        }
        return this.enabled && this.status === organizationUserStatusType_1.OrganizationUserStatusType.Confirmed;
    }
    get isManager() {
        return this.type === organizationUserType_1.OrganizationUserType.Manager || this.type === organizationUserType_1.OrganizationUserType.Owner ||
            this.type === organizationUserType_1.OrganizationUserType.Admin;
    }
    get isAdmin() {
        return this.type === organizationUserType_1.OrganizationUserType.Owner || this.type === organizationUserType_1.OrganizationUserType.Admin;
    }
    get isOwner() {
        return this.type === organizationUserType_1.OrganizationUserType.Owner;
    }
}
exports.Organization = Organization;
//# sourceMappingURL=organization.js.map