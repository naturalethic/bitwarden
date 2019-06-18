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
class ExportComponent {
    constructor(cryptoService, i18nService, platformUtilsService, exportService, win) {
        this.cryptoService = cryptoService;
        this.i18nService = i18nService;
        this.platformUtilsService = platformUtilsService;
        this.exportService = exportService;
        this.win = win;
        this.onSaved = new core_1.EventEmitter();
        this.format = 'json';
        this.showPassword = false;
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.masterPassword == null || this.masterPassword === '') {
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('invalidMasterPassword'));
                return;
            }
            const keyHash = yield this.cryptoService.hashPassword(this.masterPassword, null);
            const storedKeyHash = yield this.cryptoService.getKeyHash();
            if (storedKeyHash != null && keyHash != null && storedKeyHash === keyHash) {
                try {
                    this.formPromise = this.getExportData();
                    const data = yield this.formPromise;
                    this.platformUtilsService.eventTrack('Exported Data');
                    this.downloadFile(data);
                    this.saved();
                }
                catch (_a) { }
            }
            else {
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('invalidMasterPassword'));
            }
        });
    }
    togglePassword() {
        this.platformUtilsService.eventTrack('Toggled Master Password on Export');
        this.showPassword = !this.showPassword;
        document.getElementById('masterPassword').focus();
    }
    saved() {
        this.onSaved.emit();
    }
    getExportData() {
        return this.exportService.getExport(this.format);
    }
    getFileName(prefix) {
        return this.exportService.getFileName(prefix, this.format);
    }
    downloadFile(csv) {
        const fileName = this.getFileName();
        this.platformUtilsService.saveFile(this.win, csv, { type: 'text/plain' }, fileName);
    }
}
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ExportComponent.prototype, "onSaved", void 0);
exports.ExportComponent = ExportComponent;
//# sourceMappingURL=export.component.js.map