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
const cipherType_1 = require("../../enums/cipherType");
const constants_service_1 = require("../../services/constants.service");
class GroupingsComponent {
    constructor(collectionService, folderService, storageService, userService) {
        this.collectionService = collectionService;
        this.folderService = folderService;
        this.storageService = storageService;
        this.userService = userService;
        this.showFolders = true;
        this.showCollections = true;
        this.showFavorites = true;
        this.onAllClicked = new core_1.EventEmitter();
        this.onFavoritesClicked = new core_1.EventEmitter();
        this.onCipherTypeClicked = new core_1.EventEmitter();
        this.onFolderClicked = new core_1.EventEmitter();
        this.onAddFolder = new core_1.EventEmitter();
        this.onEditFolder = new core_1.EventEmitter();
        this.onCollectionClicked = new core_1.EventEmitter();
        this.loaded = false;
        this.cipherType = cipherType_1.CipherType;
        this.selectedAll = false;
        this.selectedFavorites = false;
        this.selectedType = null;
        this.selectedFolder = false;
        this.selectedFolderId = null;
        this.selectedCollectionId = null;
    }
    load(setLoaded = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            this.collapsedGroupingsKey = constants_service_1.ConstantsService.collapsedGroupingsKey + '_' + userId;
            const collapsedGroupings = yield this.storageService.get(this.collapsedGroupingsKey);
            if (collapsedGroupings == null) {
                this.collapsedGroupings = new Set();
            }
            else {
                this.collapsedGroupings = new Set(collapsedGroupings);
            }
            yield this.loadFolders();
            yield this.loadCollections();
            if (setLoaded) {
                this.loaded = true;
            }
        });
    }
    loadCollections(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.showCollections) {
                return;
            }
            const collections = yield this.collectionService.getAllDecrypted();
            if (organizationId != null) {
                this.collections = collections.filter((c) => c.organizationId === organizationId);
            }
            else {
                this.collections = collections;
            }
            this.nestedCollections = yield this.collectionService.getAllNested(this.collections);
        });
    }
    loadFolders() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.showFolders) {
                return;
            }
            this.folders = yield this.folderService.getAllDecrypted();
            this.nestedFolders = yield this.folderService.getAllNested();
        });
    }
    selectAll() {
        this.clearSelections();
        this.selectedAll = true;
        this.onAllClicked.emit();
    }
    selectFavorites() {
        this.clearSelections();
        this.selectedFavorites = true;
        this.onFavoritesClicked.emit();
    }
    selectType(type) {
        this.clearSelections();
        this.selectedType = type;
        this.onCipherTypeClicked.emit(type);
    }
    selectFolder(folder) {
        this.clearSelections();
        this.selectedFolder = true;
        this.selectedFolderId = folder.id;
        this.onFolderClicked.emit(folder);
    }
    addFolder() {
        this.onAddFolder.emit();
    }
    editFolder(folder) {
        this.onEditFolder.emit(folder);
    }
    selectCollection(collection) {
        this.clearSelections();
        this.selectedCollectionId = collection.id;
        this.onCollectionClicked.emit(collection);
    }
    clearSelections() {
        this.selectedAll = false;
        this.selectedFavorites = false;
        this.selectedType = null;
        this.selectedFolder = false;
        this.selectedFolderId = null;
        this.selectedCollectionId = null;
    }
    collapse(grouping, idPrefix = '') {
        if (grouping.id == null) {
            return;
        }
        const id = idPrefix + grouping.id;
        if (this.isCollapsed(grouping, idPrefix)) {
            this.collapsedGroupings.delete(id);
        }
        else {
            this.collapsedGroupings.add(id);
        }
        this.storageService.save(this.collapsedGroupingsKey, this.collapsedGroupings);
    }
    isCollapsed(grouping, idPrefix = '') {
        return this.collapsedGroupings.has(idPrefix + grouping.id);
    }
}
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], GroupingsComponent.prototype, "showFolders", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], GroupingsComponent.prototype, "showCollections", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], GroupingsComponent.prototype, "showFavorites", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GroupingsComponent.prototype, "onAllClicked", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GroupingsComponent.prototype, "onFavoritesClicked", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GroupingsComponent.prototype, "onCipherTypeClicked", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GroupingsComponent.prototype, "onFolderClicked", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GroupingsComponent.prototype, "onAddFolder", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GroupingsComponent.prototype, "onEditFolder", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], GroupingsComponent.prototype, "onCollectionClicked", void 0);
exports.GroupingsComponent = GroupingsComponent;
//# sourceMappingURL=groupings.component.js.map