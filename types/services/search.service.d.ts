import * as lunr from 'lunr';
import { CipherView } from '../models/view/cipherView';
import { CipherService } from '../abstractions/cipher.service';
import { PlatformUtilsService } from '../abstractions/platformUtils.service';
import { SearchService as SearchServiceAbstraction } from '../abstractions/search.service';
export declare class SearchService implements SearchServiceAbstraction {
    private cipherService;
    private indexing;
    private index;
    private onlySearchName;
    constructor(cipherService: CipherService, platformUtilsService: PlatformUtilsService);
    clearIndex(): void;
    isSearchable(query: string): boolean;
    indexCiphers(): Promise<void>;
    searchCiphers(query: string, filter?: (cipher: CipherView) => boolean, ciphers?: CipherView[]): Promise<CipherView[]>;
    searchCiphersBasic(ciphers: CipherView[], query: string): CipherView[];
    getIndexForSearch(): lunr.Index;
    private fieldExtractor;
    private attachmentExtractor;
    private uriExtractor;
}
