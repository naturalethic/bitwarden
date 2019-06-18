import { SelectionReadOnlyRequest } from './selectionReadOnlyRequest';
export declare class GroupRequest {
    name: string;
    accessAll: boolean;
    externalId: string;
    collections: SelectionReadOnlyRequest[];
}
