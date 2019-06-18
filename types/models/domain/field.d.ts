import { FieldType } from '../../enums/fieldType';
import { FieldData } from '../data/fieldData';
import { CipherString } from './cipherString';
import Domain from './domainBase';
import { FieldView } from '../view/fieldView';
export declare class Field extends Domain {
    name: CipherString;
    value: CipherString;
    type: FieldType;
    constructor(obj?: FieldData, alreadyEncrypted?: boolean);
    decrypt(orgId: string): Promise<FieldView>;
    toFieldData(): FieldData;
}
