import { BaseResponse } from './baseResponse';
import { SelectionReadOnlyResponse } from './selectionReadOnlyResponse';
export declare class CollectionResponse extends BaseResponse {
    id: string;
    organizationId: string;
    name: string;
    externalId: string;
    constructor(response: any);
}
export declare class CollectionDetailsResponse extends CollectionResponse {
    readOnly: boolean;
    constructor(response: any);
}
export declare class CollectionGroupDetailsResponse extends CollectionResponse {
    groups: SelectionReadOnlyResponse[];
    constructor(response: any);
}
