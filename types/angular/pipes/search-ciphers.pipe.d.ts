import { PipeTransform } from '@angular/core';
import { CipherView } from '../../models/view/cipherView';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
export declare class SearchCiphersPipe implements PipeTransform {
    private onlySearchName;
    constructor(platformUtilsService: PlatformUtilsService);
    transform(ciphers: CipherView[], searchText: string): CipherView[];
}
