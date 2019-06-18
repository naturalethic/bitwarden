import { EventEmitter, OnInit } from '@angular/core';
import { FolderService } from '../../abstractions/folder.service';
import { I18nService } from '../../abstractions/i18n.service';
import { PlatformUtilsService } from '../../abstractions/platformUtils.service';
import { FolderView } from '../../models/view/folderView';
export declare class FolderAddEditComponent implements OnInit {
    protected folderService: FolderService;
    protected i18nService: I18nService;
    protected platformUtilsService: PlatformUtilsService;
    folderId: string;
    onSavedFolder: EventEmitter<FolderView>;
    onDeletedFolder: EventEmitter<FolderView>;
    editMode: boolean;
    folder: FolderView;
    title: string;
    formPromise: Promise<any>;
    deletePromise: Promise<any>;
    constructor(folderService: FolderService, i18nService: I18nService, platformUtilsService: PlatformUtilsService);
    ngOnInit(): Promise<void>;
    submit(): Promise<boolean>;
    delete(): Promise<boolean>;
    protected init(): Promise<void>;
}
