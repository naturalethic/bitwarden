import { MessagingService } from '../../abstractions/messaging.service';
import { WindowMain } from '../window.main';
export declare class ElectronMainMessagingService implements MessagingService {
    private windowMain;
    private onMessage;
    constructor(windowMain: WindowMain, onMessage: (message: any) => void);
    send(subscriber: string, arg?: any): void;
}
