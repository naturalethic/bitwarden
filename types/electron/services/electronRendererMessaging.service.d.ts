import { MessagingService } from '../../abstractions/messaging.service';
import { BroadcasterService } from '../../angular/services/broadcaster.service';
export declare class ElectronRendererMessagingService implements MessagingService {
    private broadcasterService;
    constructor(broadcasterService: BroadcasterService);
    send(subscriber: string, arg?: any): void;
    private sendMessage;
}
