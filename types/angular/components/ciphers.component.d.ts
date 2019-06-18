import { EventEmitter } from '@angular/core';
import { SearchService } from '../../abstractions/search.service';
import { CipherView } from '../../models/view/cipherView';
export declare class CiphersComponent {
    protected searchService: SearchService;
    activeCipherId: string;
    onCipherClicked: EventEmitter<CipherView>;
    onCipherRightClicked: EventEmitter<CipherView>;
    onAddCipher: EventEmitter<{}>;
    onAddCipherOptions: EventEmitter<{}>;
    loaded: boolean;
    ciphers: CipherView[];
    pagedCiphers: CipherView[];
    searchText: string;
    searchPlaceholder: string;
    filter: (cipher: CipherView) => boolean;
    protected searchPending: boolean;
    protected didScroll: boolean;
    protected pageSize: number;
    private searchTimeout;
    private pagedCiphersCount;
    private refreshing;
    constructor(searchService: SearchService);
    load(filter?: (cipher: CipherView) => boolean): Promise<void>;
    loadMore(): void;
    reload(filter?: (cipher: CipherView) => boolean): Promise<void>;
    refresh(): Promise<void>;
    applyFilter(filter?: (cipher: CipherView) => boolean): Promise<void>;
    search(timeout?: number): Promise<void>;
    selectCipher(cipher: CipherView): void;
    rightClickCipher(cipher: CipherView): void;
    addCipher(): void;
    addCipherOptions(): void;
    isSearching(): boolean;
    isPaging(): boolean;
    resetPaging(): Promise<void>;
}
