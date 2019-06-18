import { BroadcasterService as BroadcasterServiceAbstraction } from '../abstractions/broadcaster.service';
export declare class BroadcasterService implements BroadcasterServiceAbstraction {
    subscribers: Map<string, (message: any) => any>;
    send(message: any, id?: string): void;
    subscribe(id: string, messageCallback: (message: any) => any): void;
    unsubscribe(id: string): void;
}
