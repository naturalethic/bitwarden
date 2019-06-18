import { ApiService } from './api.service';
import { PlatformUtilsService } from '../abstractions/platformUtils.service';
import { TokenService } from '../abstractions/token.service';
export declare class NodeApiService extends ApiService {
    constructor(tokenService: TokenService, platformUtilsService: PlatformUtilsService, logoutCallback: (expired: boolean) => Promise<void>);
}
