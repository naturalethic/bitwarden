import { Collection } from './collection';
import { CollectionView } from '../view/collectionView';
export declare class CollectionWithId extends Collection {
    id: string;
    build(o: CollectionView): void;
}
