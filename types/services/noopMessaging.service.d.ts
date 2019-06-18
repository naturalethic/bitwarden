import { MessagingService } from '../abstractions/messaging.service';
export declare class NoopMessagingService implements MessagingService {
    send(subscriber: string, arg?: any): void;
}
