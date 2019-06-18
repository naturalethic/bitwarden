import { BaseResponse } from './response/baseResponse';
export declare class Response {
    static error(error: any): Response;
    static notFound(): Response;
    static badRequest(message: string): Response;
    static multipleResults(ids: string[]): Response;
    static success(data?: BaseResponse): Response;
    success: boolean;
    message: string;
    errorCode: number;
    data: BaseResponse;
}
