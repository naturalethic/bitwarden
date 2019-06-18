import { View } from './view';
import { Folder } from '../domain/folder';
import { ITreeNodeObject } from '../domain/treeNode';
export declare class FolderView implements View, ITreeNodeObject {
    id: string;
    name: string;
    revisionDate: Date;
    constructor(f?: Folder);
}
