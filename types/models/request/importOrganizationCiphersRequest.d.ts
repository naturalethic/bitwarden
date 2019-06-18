import { CipherRequest } from './cipherRequest';
import { CollectionRequest } from './collectionRequest';
import { KvpRequest } from './kvpRequest';
export declare class ImportOrganizationCiphersRequest {
    ciphers: CipherRequest[];
    collections: CollectionRequest[];
    collectionRelationships: Array<KvpRequest<number, number>>;
}
