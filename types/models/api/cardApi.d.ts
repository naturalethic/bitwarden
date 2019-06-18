import { BaseResponse } from '../response/baseResponse';
export declare class CardApi extends BaseResponse {
    cardholderName: string;
    brand: string;
    number: string;
    expMonth: string;
    expYear: string;
    code: string;
    constructor(data?: any);
}
