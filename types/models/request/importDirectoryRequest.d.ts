import { ImportDirectoryRequestGroup } from './importDirectoryRequestGroup';
import { ImportDirectoryRequestUser } from './importDirectoryRequestUser';
export declare class ImportDirectoryRequest {
    groups: ImportDirectoryRequestGroup[];
    users: ImportDirectoryRequestUser[];
    overwriteExisting: boolean;
}
