import { FolderRequest } from './folderRequest';
import { Folder } from '../domain/folder';
export declare class FolderWithIdRequest extends FolderRequest {
    id: string;
    constructor(folder: Folder);
}
