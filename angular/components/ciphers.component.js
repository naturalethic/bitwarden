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
class CiphersComponent {
    constructor(searchService) {
        this.searchService = searchService;
        this.activeCipherId = null;
        this.onCipherClicked = new core_1.EventEmitter();
        this.onCipherRightClicked = new core_1.EventEmitter();
        this.onAddCipher = new core_1.EventEmitter();
        this.onAddCipherOptions = new core_1.EventEmitter();
        this.loaded = false;
        this.ciphers = [];
        this.pagedCiphers = [];
        this.searchPlaceholder = null;
        this.filter = null;
        this.searchPending = false;
        this.didScroll = false;
        this.pageSize = 100;
        this.searchTimeout = null;
        this.pagedCiphersCount = 0;
        this.refreshing = false;
    }
    load(filter = null) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.applyFilter(filter);
            this.loaded = true;
        });
    }
    loadMore() {
        if (this.ciphers.length <= this.pageSize) {
            return;
        }
        const pagedLength = this.pagedCiphers.length;
        let pagedSize = this.pageSize;
        if (this.refreshing && pagedLength === 0 && this.pagedCiphersCount > this.pageSize) {
            pagedSize = this.pagedCiphersCount;
        }
        if (this.ciphers.length > pagedLength) {
            this.pagedCiphers = this.pagedCiphers.concat(this.ciphers.slice(pagedLength, pagedLength + pagedSize));
        }
        this.pagedCiphersCount = this.pagedCiphers.length;
        this.didScroll = this.pagedCiphers.length > this.pageSize;
    }
    reload(filter = null) {
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded = false;
            this.ciphers = [];
            yield this.load(filter);
        });
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.refreshing = true;
                yield this.reload(this.filter);
            }
            finally {
                this.refreshing = false;
            }
        });
    }
    applyFilter(filter = null) {
        return __awaiter(this, void 0, void 0, function* () {
            this.filter = filter;
            yield this.search(null);
        });
    }
    search(timeout = null) {
        return __awaiter(this, void 0, void 0, function* () {
            this.searchPending = false;
            if (this.searchTimeout != null) {
                clearTimeout(this.searchTimeout);
            }
            if (timeout == null) {
                this.ciphers = yield this.searchService.searchCiphers(this.searchText, this.filter);
                yield this.resetPaging();
                return;
            }
            this.searchPending = true;
            this.searchTimeout = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                this.ciphers = yield this.searchService.searchCiphers(this.searchText, this.filter);
                yield this.resetPaging();
                this.searchPending = false;
            }), timeout);
        });
    }
    selectCipher(cipher) {
        this.onCipherClicked.emit(cipher);
    }
    rightClickCipher(cipher) {
        this.onCipherRightClicked.emit(cipher);
    }
    addCipher() {
        this.onAddCipher.emit();
    }
    addCipherOptions() {
        this.onAddCipherOptions.emit();
    }
    isSearching() {
        return !this.searchPending && this.searchService.isSearchable(this.searchText);
    }
    isPaging() {
        const searching = this.isSearching();
        if (searching && this.didScroll) {
            this.resetPaging();
        }
        return !searching && this.ciphers.length > this.pageSize;
    }
    resetPaging() {
        return __awaiter(this, void 0, void 0, function* () {
            this.pagedCiphers = [];
            this.loadMore();
        });
    }
}
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], CiphersComponent.prototype, "activeCipherId", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], CiphersComponent.prototype, "onCipherClicked", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], CiphersComponent.prototype, "onCipherRightClicked", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], CiphersComponent.prototype, "onAddCipher", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], CiphersComponent.prototype, "onAddCipherOptions", void 0);
exports.CiphersComponent = CiphersComponent;
//# sourceMappingURL=ciphers.component.js.map