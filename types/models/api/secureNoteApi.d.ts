import { BaseResponse } from '../response/baseResponse';
import { SecureNoteType } from '../../enums/secureNoteType';
export declare class SecureNoteApi extends BaseResponse {
    type: SecureNoteType;
    constructor(data?: any);
}
