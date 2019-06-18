import { BaseResponse } from './baseResponse';
import { KdfType } from '../../enums/kdfType';
export declare class PreloginResponse extends BaseResponse {
    kdf: KdfType;
    kdfIterations: number;
    constructor(response: any);
}
