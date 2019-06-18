import { FolderResponse } from '../response/folderResponse';
export declare class FolderData {
    id: string;
    userId: string;
    name: string;
    revisionDate: string;
    constructor(response: FolderResponse, userId: string);
}
