import { ITreeNodeObject, TreeNode } from '../models/domain/treeNode';
export declare class ServiceUtils {
    static nestedTraverse(nodeTree: Array<TreeNode<ITreeNodeObject>>, partIndex: number, parts: string[], obj: ITreeNodeObject, parent: ITreeNodeObject, delimiter: string): void;
    static getTreeNodeObject(nodeTree: Array<TreeNode<ITreeNodeObject>>, id: string): TreeNode<ITreeNodeObject>;
}
