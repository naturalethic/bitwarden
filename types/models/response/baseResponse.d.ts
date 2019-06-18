export declare abstract class BaseResponse {
    protected response: any;
    constructor(response: any);
    protected getResponseProperty(propertyName: string, response?: any, exactName?: boolean): any;
}
