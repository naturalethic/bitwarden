import { Collection } from '../domain/collection';
import { SelectionReadOnlyRequest } from './selectionReadOnlyRequest';
export declare class CollectionRequest {
    name: string;
    externalId: string;
    groups: SelectionReadOnlyRequest[];
    constructor(collection?: Collection);
}
