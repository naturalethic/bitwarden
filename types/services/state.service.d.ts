import { StateService as StateServiceAbstraction } from '../abstractions/state.service';
export declare class StateService implements StateServiceAbstraction {
    private state;
    get<T>(key: string): Promise<T>;
    save(key: string, obj: any): Promise<any>;
    remove(key: string): Promise<any>;
    purge(): Promise<any>;
}
