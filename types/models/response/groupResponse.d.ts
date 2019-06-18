import { BaseResponse } from './baseResponse';
import { SelectionReadOnlyResponse } from './selectionReadOnlyResponse';
export declare class GroupResponse extends BaseResponse {
    id: string;
    organizationId: string;
    name: string;
    accessAll: boolean;
    externalId: string;
    constructor(response: any);
}
export declare class GroupDetailsResponse extends GroupResponse {
    collections: SelectionReadOnlyResponse[];
    constructor(response: any);
}
