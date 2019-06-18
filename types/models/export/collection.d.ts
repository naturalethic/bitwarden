import { CollectionView } from '../view/collectionView';
export declare class Collection {
    static template(): Collection;
    static toView(req: Collection, view?: CollectionView): CollectionView;
    organizationId: string;
    name: string;
    externalId: string;
    build(o: CollectionView): void;
}
