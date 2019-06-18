import { FieldType } from '../../enums/fieldType';
import { FieldApi } from '../api/fieldApi';
export declare class FieldData {
    type: FieldType;
    name: string;
    value: string;
    constructor(response?: FieldApi);
}
