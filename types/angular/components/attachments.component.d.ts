import { EventEmitter, OnInit } from '@angular/core';
import { CipherService } from '../../abstractions/cipher.service';
import { CryptoService } from '../../abstractions/crypto.service';
import { I18nService } from '../../abstractions/i18n.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
import { UserService } from '../../abstractions/user.service';
import { Cipher } from '../../models/domain/cipher';
import { AttachmentView } from '../../models/view/attachmentView';
import { CipherView } from '../../models/view/cipherView';
export declare class AttachmentsComponent implements OnInit {
    protected cipherService: CipherService;
    protected i18nService: I18nService;
    protected cryptoService: CryptoService;
    protected userService: UserService;
    protected platformUtilsService: PlatformUtilsService;
    protected win: Window;
    cipherId: string;
    onUploadedAttachment: EventEmitter<{}>;
    onDeletedAttachment: EventEmitter<{}>;
    onReuploadedAttachment: EventEmitter<{}>;
    cipher: CipherView;
    cipherDomain: Cipher;
    hasUpdatedKey: boolean;
    canAccessAttachments: boolean;
    formPromise: Promise<any>;
    deletePromises: {
        [id: string]: Promise<any>;
    };
    reuploadPromises: {
        [id: string]: Promise<any>;
    };
    constructor(cipherService: CipherService, i18nService: I18nService, cryptoService: CryptoService, userService: UserService, platformUtilsService: PlatformUtilsService, win: Window);
    ngOnInit(): Promise<void>;
    submit(): Promise<void>;
    delete(attachment: AttachmentView): Promise<void>;
    download(attachment: AttachmentView): Promise<void>;
    protected init(): Promise<void>;
    protected reuploadCipherAttachment(attachment: AttachmentView, admin: boolean): Promise<void>;
    protected loadCipher(): Promise<Cipher>;
    protected saveCipherAttachment(file: File): Promise<Cipher>;
    protected deleteCipherAttachment(attachmentId: string): Promise<void>;
}
