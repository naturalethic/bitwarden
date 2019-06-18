import { View } from './view';
import { Collection } from '../domain/collection';
import { ITreeNodeObject } from '../domain/treeNode';
export declare class CollectionView implements View, ITreeNodeObject {
    id: string;
    organizationId: string;
    name: string;
    externalId: string;
    readOnly: boolean;
    constructor(c?: Collection);
}
