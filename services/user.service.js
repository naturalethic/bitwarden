"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const organization_1 = require("../models/domain/organization");
const Keys = {
    userId: 'userId',
    userEmail: 'userEmail',
    stamp: 'securityStamp',
    kdf: 'kdf',
    kdfIterations: 'kdfIterations',
    organizationsPrefix: 'organizations_',
};
class UserService {
    constructor(tokenService, storageService) {
        this.tokenService = tokenService;
        this.storageService = storageService;
    }
    setInformation(userId, email, kdf, kdfIterations) {
        this.email = email;
        this.userId = userId;
        this.kdf = kdf;
        this.kdfIterations = kdfIterations;
        return Promise.all([
            this.storageService.save(Keys.userEmail, email),
            this.storageService.save(Keys.userId, userId),
            this.storageService.save(Keys.kdf, kdf),
            this.storageService.save(Keys.kdfIterations, kdfIterations),
        ]);
    }
    setSecurityStamp(stamp) {
        this.stamp = stamp;
        return this.storageService.save(Keys.stamp, stamp);
    }
    getUserId() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.userId == null) {
                this.userId = yield this.storageService.get(Keys.userId);
            }
            return this.userId;
        });
    }
    getEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.email == null) {
                this.email = yield this.storageService.get(Keys.userEmail);
            }
            return this.email;
        });
    }
    getSecurityStamp() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.stamp == null) {
                this.stamp = yield this.storageService.get(Keys.stamp);
            }
            return this.stamp;
        });
    }
    getKdf() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.kdf == null) {
                this.kdf = yield this.storageService.get(Keys.kdf);
            }
            return this.kdf;
        });
    }
    getKdfIterations() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.kdfIterations == null) {
                this.kdfIterations = yield this.storageService.get(Keys.kdfIterations);
            }
            return this.kdfIterations;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.getUserId();
            yield Promise.all([
                this.storageService.remove(Keys.userId),
                this.storageService.remove(Keys.userEmail),
                this.storageService.remove(Keys.stamp),
                this.storageService.remove(Keys.kdf),
                this.storageService.remove(Keys.kdfIterations),
                this.clearOrganizations(userId),
            ]);
            this.userId = this.email = this.stamp = null;
            this.kdf = null;
            this.kdfIterations = null;
        });
    }
    isAuthenticated() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.tokenService.getToken();
            if (token == null) {
                return false;
            }
            const userId = yield this.getUserId();
            return userId != null;
        });
    }
    canAccessPremium() {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenPremium = this.tokenService.getPremium();
            if (tokenPremium) {
                return true;
            }
            const orgs = yield this.getAllOrganizations();
            for (let i = 0; i < orgs.length; i++) {
                if (orgs[i].usersGetPremium && orgs[i].enabled) {
                    return true;
                }
            }
            return false;
        });
    }
    getOrganization(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.getUserId();
            const organizations = yield this.storageService.get(Keys.organizationsPrefix + userId);
            if (organizations == null || !organizations.hasOwnProperty(id)) {
                return null;
            }
            return new organization_1.Organization(organizations[id]);
        });
    }
    getAllOrganizations() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.getUserId();
            const organizations = yield this.storageService.get(Keys.organizationsPrefix + userId);
            const response = [];
            for (const id in organizations) {
                if (organizations.hasOwnProperty(id)) {
                    response.push(new organization_1.Organization(organizations[id]));
                }
            }
            return response;
        });
    }
    replaceOrganizations(organizations) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.getUserId();
            yield this.storageService.save(Keys.organizationsPrefix + userId, organizations);
        });
    }
    clearOrganizations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storageService.remove(Keys.organizationsPrefix + userId);
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map