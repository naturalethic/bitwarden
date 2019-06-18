import { FieldType } from '../../enums/fieldType';
import { View } from './view';
import { Field } from '../domain/field';
export declare class FieldView implements View {
    name: string;
    value: string;
    type: FieldType;
    constructor(f?: Field);
    readonly maskedValue: string;
}
