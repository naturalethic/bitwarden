import { BaseResponse } from './baseResponse';
export declare class ErrorResponse extends BaseResponse {
    message: string;
    validationErrors: {
        [key: string]: string[];
    };
    statusCode: number;
    constructor(response: any, status: number, identityResponse?: boolean);
    getSingleMessage(): string;
    getAllMessages(): string[];
}
