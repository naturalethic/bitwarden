import { CollectionDetailsResponse } from '../response/collectionResponse';
export declare class CollectionData {
    id: string;
    organizationId: string;
    name: string;
    externalId: string;
    readOnly: boolean;
    constructor(response: CollectionDetailsResponse);
}
