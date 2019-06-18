import { Folder } from './folder';
import { FolderView } from '../view/folderView';
export declare class FolderWithId extends Folder {
    id: string;
    build(o: FolderView): void;
}
