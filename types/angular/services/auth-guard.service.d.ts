import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LockService } from '../../abstractions/lock.service';
import { MessagingService } from '../../abstractions/messaging.service';
import { UserService } from '../../abstractions/user.service';
export declare class AuthGuardService implements CanActivate {
    private lockService;
    private userService;
    private router;
    private messagingService;
    constructor(lockService: LockService, userService: UserService, router: Router, messagingService: MessagingService);
    canActivate(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Promise<boolean>;
}
