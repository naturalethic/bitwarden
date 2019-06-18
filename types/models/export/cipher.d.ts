import { CipherType } from '../../enums/cipherType';
import { CipherView } from '../view/cipherView';
import { Card } from './card';
import { Field } from './field';
import { Identity } from './identity';
import { Login } from './login';
import { SecureNote } from './secureNote';
export declare class Cipher {
    static template(): Cipher;
    static toView(req: Cipher, view?: CipherView): CipherView;
    type: CipherType;
    folderId: string;
    organizationId: string;
    name: string;
    notes: string;
    favorite: boolean;
    fields: Field[];
    login: Login;
    secureNote: SecureNote;
    card: Card;
    identity: Identity;
    build(o: CipherView): void;
}
