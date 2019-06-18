import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EventEmitter, OnInit } from '@angular/core';
import { CipherType } from '../../enums/cipherType';
import { FieldType } from '../../enums/fieldType';
import { AuditService } from '../../abstractions/audit.service';
import { CipherService } from '../../abstractions/cipher.service';
import { CollectionService } from '../../abstractions/collection.service';
import { FolderService } from '../../abstractions/folder.service';
import { I18nService } from '../../abstractions/i18n.service';
import { MessagingService } from '../../abstractions/messaging.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
import { StateService } from '../../abstractions/state.service';
import { UserService } from '../../abstractions/user.service';
import { Cipher } from '../../models/domain/cipher';
import { CipherView } from '../../models/view/cipherView';
import { CollectionView } from '../../models/view/collectionView';
import { FieldView } from '../../models/view/fieldView';
import { FolderView } from '../../models/view/folderView';
import { LoginUriView } from '../../models/view/loginUriView';
export declare class AddEditComponent implements OnInit {
    protected cipherService: CipherService;
    protected folderService: FolderService;
    protected i18nService: I18nService;
    protected platformUtilsService: PlatformUtilsService;
    protected auditService: AuditService;
    protected stateService: StateService;
    protected userService: UserService;
    protected collectionService: CollectionService;
    protected messagingService: MessagingService;
    folderId: string;
    cipherId: string;
    type: CipherType;
    collectionIds: string[];
    organizationId: string;
    onSavedCipher: EventEmitter<CipherView>;
    onDeletedCipher: EventEmitter<CipherView>;
    onCancelled: EventEmitter<CipherView>;
    onEditAttachments: EventEmitter<CipherView>;
    onShareCipher: EventEmitter<CipherView>;
    onEditCollections: EventEmitter<CipherView>;
    onGeneratePassword: EventEmitter<{}>;
    editMode: boolean;
    cipher: CipherView;
    folders: FolderView[];
    collections: CollectionView[];
    title: string;
    formPromise: Promise<any>;
    deletePromise: Promise<any>;
    checkPasswordPromise: Promise<number>;
    showPassword: boolean;
    showCardCode: boolean;
    cipherType: typeof CipherType;
    fieldType: typeof FieldType;
    addFieldType: FieldType;
    typeOptions: any[];
    cardBrandOptions: any[];
    cardExpMonthOptions: any[];
    identityTitleOptions: any[];
    addFieldTypeOptions: any[];
    uriMatchOptions: any[];
    ownershipOptions: any[];
    protected writeableCollections: CollectionView[];
    constructor(cipherService: CipherService, folderService: FolderService, i18nService: I18nService, platformUtilsService: PlatformUtilsService, auditService: AuditService, stateService: StateService, userService: UserService, collectionService: CollectionService, messagingService: MessagingService);
    ngOnInit(): Promise<void>;
    init(): Promise<void>;
    load(): Promise<void>;
    submit(): Promise<boolean>;
    addUri(): void;
    removeUri(uri: LoginUriView): void;
    addField(): void;
    removeField(field: FieldView): void;
    trackByFunction(index: number, item: any): number;
    cancel(): void;
    attachments(): void;
    share(): void;
    editCollections(): void;
    delete(): Promise<boolean>;
    generatePassword(): Promise<boolean>;
    togglePassword(): void;
    toggleCardCode(): void;
    toggleFieldValue(field: FieldView): void;
    toggleUriOptions(uri: LoginUriView): void;
    loginUriMatchChanged(uri: LoginUriView): void;
    drop(event: CdkDragDrop<string[]>): void;
    organizationChanged(): Promise<void>;
    checkPassword(): Promise<void>;
    protected loadCollections(): Promise<CollectionView[]>;
    protected loadCipher(): Promise<Cipher>;
    protected encryptCipher(): Promise<Cipher>;
    protected saveCipher(cipher: Cipher): Promise<any>;
    protected deleteCipher(): Promise<any>;
}
