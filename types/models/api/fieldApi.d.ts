import { BaseResponse } from '../response/baseResponse';
import { FieldType } from '../../enums/fieldType';
export declare class FieldApi extends BaseResponse {
    name: string;
    value: string;
    type: FieldType;
    constructor(data?: any);
}
