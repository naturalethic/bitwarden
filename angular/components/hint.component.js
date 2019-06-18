"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const passwordHintRequest_1 = require("../../models/request/passwordHintRequest");
class HintComponent {
    constructor(router, i18nService, apiService, platformUtilsService) {
        this.router = router;
        this.i18nService = i18nService;
        this.apiService = apiService;
        this.platformUtilsService = platformUtilsService;
        this.email = '';
        this.successRoute = 'login';
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.email == null || this.email === '') {
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('emailRequired'));
                return;
            }
            if (this.email.indexOf('@') === -1) {
                this.platformUtilsService.showToast('error', this.i18nService.t('errorOccurred'), this.i18nService.t('invalidEmail'));
                return;
            }
            try {
                this.formPromise = this.apiService.postPasswordHint(new passwordHintRequest_1.PasswordHintRequest(this.email));
                yield this.formPromise;
                this.platformUtilsService.eventTrack('Requested Hint');
                this.platformUtilsService.showToast('success', null, this.i18nService.t('masterPassSent'));
                if (this.onSuccessfulSubmit != null) {
                    this.onSuccessfulSubmit();
                }
                else if (this.router != null) {
                    this.router.navigate([this.successRoute]);
                }
            }
            catch (_a) { }
        });
    }
}
exports.HintComponent = HintComponent;
//# sourceMappingURL=hint.component.js.map