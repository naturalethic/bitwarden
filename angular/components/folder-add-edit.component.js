"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const folderView_1 = require("../../models/view/folderView");
class FolderAddEditComponent {
    constructor(folderService, i18nService, platformUtilsService) {
        this.folderService = folderService;
        this.i18nService = i18nService;
        this.platformUtilsService = platformUtilsService;
        this.onSavedFolder = new core_1.EventEmitter();
        this.onDeletedFolder = new core_1.EventEmitter();
        this.editMode = false;
        this.folder = new folderView_1.FolderView();
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
        });
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.folder.name == null || this.folder.name === '') {
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('nameRequired'));
                return false;
            }
            try {
                const folder = yield this.folderService.encrypt(this.folder);
                this.formPromise = this.folderService.saveWithServer(folder);
                yield this.formPromise;
                this.platformUtilsService.eventTrack(this.editMode ? 'Edited Folder' : 'Added Folder');
                this.platformUtilsService.showToast('success', null, this.i18nService.t(this.editMode ? 'editedFolder' : 'addedFolder'));
                this.onSavedFolder.emit(this.folder);
                return true;
            }
            catch (_a) { }
            return false;
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const confirmed = yield this.platformUtilsService.showDialog(this.i18nService.t('deleteFolderConfirmation'), this.i18nService.t('deleteFolder'), this.i18nService.t('yes'), this.i18nService.t('no'), 'warning');
            if (!confirmed) {
                return false;
            }
            try {
                this.deletePromise = this.folderService.deleteWithServer(this.folder.id);
                yield this.deletePromise;
                this.platformUtilsService.eventTrack('Deleted Folder');
                this.platformUtilsService.showToast('success', null, this.i18nService.t('deletedFolder'));
                this.onDeletedFolder.emit(this.folder);
            }
            catch (_a) { }
            return true;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.editMode = this.folderId != null;
            if (this.editMode) {
                this.editMode = true;
                this.title = this.i18nService.t('editFolder');
                const folder = yield this.folderService.get(this.folderId);
                this.folder = yield folder.decrypt();
            }
            else {
                this.title = this.i18nService.t('addFolder');
            }
        });
    }
}
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], FolderAddEditComponent.prototype, "folderId", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], FolderAddEditComponent.prototype, "onSavedFolder", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], FolderAddEditComponent.prototype, "onDeletedFolder", void 0);
exports.FolderAddEditComponent = FolderAddEditComponent;
//# sourceMappingURL=folder-add-edit.component.js.map