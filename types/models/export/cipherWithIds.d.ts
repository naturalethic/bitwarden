import { Cipher } from './cipher';
import { CipherView } from '../view/cipherView';
export declare class CipherWithIds extends Cipher {
    id: string;
    collectionIds: string[];
    build(o: CipherView): void;
}
