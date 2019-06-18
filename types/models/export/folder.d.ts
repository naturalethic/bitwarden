import { FolderView } from '../view/folderView';
export declare class Folder {
    static template(): Folder;
    static toView(req: Folder, view?: FolderView): FolderView;
    name: string;
    build(o: FolderView): void;
}
