import { FieldType } from '../../enums/fieldType';
import { FieldView } from '../view/fieldView';
export declare class Field {
    static template(): Field;
    static toView(req: Field, view?: FieldView): FieldView;
    name: string;
    value: string;
    type: FieldType;
    constructor(o?: FieldView);
}
