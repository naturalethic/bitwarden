import { CollectionData } from '../data/collectionData';
import { CollectionView } from '../view/collectionView';
import { CipherString } from './cipherString';
import Domain from './domainBase';
export declare class Collection extends Domain {
    id: string;
    organizationId: string;
    name: CipherString;
    externalId: string;
    readOnly: boolean;
    constructor(obj?: CollectionData, alreadyEncrypted?: boolean);
    decrypt(): Promise<CollectionView>;
}
