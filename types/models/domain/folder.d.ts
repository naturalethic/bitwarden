import { FolderData } from '../data/folderData';
import { FolderView } from '../view/folderView';
import { CipherString } from './cipherString';
import Domain from './domainBase';
export declare class Folder extends Domain {
    id: string;
    name: CipherString;
    revisionDate: Date;
    constructor(obj?: FolderData, alreadyEncrypted?: boolean);
    decrypt(): Promise<FolderView>;
}
