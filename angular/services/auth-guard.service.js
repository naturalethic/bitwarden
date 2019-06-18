"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const lock_service_1 = require("../../abstractions/lock.service");
const messaging_service_1 = require("../../abstractions/messaging.service");
const user_service_1 = require("../../abstractions/user.service");
let AuthGuardService = class AuthGuardService {
    constructor(lockService, userService, router, messagingService) {
        this.lockService = lockService;
        this.userService = userService;
        this.router = router;
        this.messagingService = messagingService;
    }
    canActivate(route, routerState) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAuthed = yield this.userService.isAuthenticated();
            if (!isAuthed) {
                this.messagingService.send('authBlocked');
                return false;
            }
            const locked = yield this.lockService.isLocked();
            if (locked) {
                if (routerState != null) {
                    this.messagingService.send('lockedUrl', { url: routerState.url });
                }
                this.router.navigate(['lock']);
                return false;
            }
            return true;
        });
    }
};
AuthGuardService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [lock_service_1.LockService, user_service_1.UserService, router_1.Router,
        messaging_service_1.MessagingService])
], AuthGuardService);
exports.AuthGuardService = AuthGuardService;
//# sourceMappingURL=auth-guard.service.js.map