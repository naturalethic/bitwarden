import { EventEmitter, OnInit } from '@angular/core';
import { CipherService } from '../../abstractions/cipher.service';
import { CollectionService } from '../../abstractions/collection.service';
import { I18nService } from '../../abstractions/i18n.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
import { CipherView } from '../../models/view/cipherView';
import { CollectionView } from '../../models/view/collectionView';
import { Cipher } from '../../models/domain/cipher';
export declare class CollectionsComponent implements OnInit {
    protected collectionService: CollectionService;
    protected platformUtilsService: PlatformUtilsService;
    protected i18nService: I18nService;
    protected cipherService: CipherService;
    cipherId: string;
    onSavedCollections: EventEmitter<{}>;
    formPromise: Promise<any>;
    cipher: CipherView;
    collectionIds: string[];
    collections: CollectionView[];
    protected cipherDomain: Cipher;
    constructor(collectionService: CollectionService, platformUtilsService: PlatformUtilsService, i18nService: I18nService, cipherService: CipherService);
    ngOnInit(): Promise<void>;
    load(): Promise<void>;
    submit(): Promise<void>;
    protected loadCipher(): Promise<Cipher>;
    protected loadCipherCollections(): string[];
    protected loadCollections(): Promise<CollectionView[]>;
    protected saveCollections(): Promise<any>;
}
