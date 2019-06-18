import { BaseResponse } from './baseResponse';
import { CipherResponse } from './cipherResponse';
import { CollectionDetailsResponse } from './collectionResponse';
import { DomainsResponse } from './domainsResponse';
import { FolderResponse } from './folderResponse';
import { ProfileResponse } from './profileResponse';
export declare class SyncResponse extends BaseResponse {
    profile?: ProfileResponse;
    folders: FolderResponse[];
    collections: CollectionDetailsResponse[];
    ciphers: CipherResponse[];
    domains?: DomainsResponse;
    constructor(response: any);
}
