export declare class TreeNode<T extends ITreeNodeObject> {
    parent: T;
    node: T;
    children: Array<TreeNode<T>>;
    constructor(node: T, name: string, parent: T);
}
export interface ITreeNodeObject {
    id: string;
    name: string;
}
