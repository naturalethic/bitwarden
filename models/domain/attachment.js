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
const attachmentData_1 = require("../data/attachmentData");
const attachmentView_1 = require("../view/attachmentView");
const domainBase_1 = require("./domainBase");
const symmetricCryptoKey_1 = require("./symmetricCryptoKey");
const utils_1 = require("../../misc/utils");
class Attachment extends domainBase_1.default {
    constructor(obj, alreadyEncrypted = false) {
        super();
        if (obj == null) {
            return;
        }
        this.size = obj.size;
        this.buildDomainModel(this, obj, {
            id: null,
            url: null,
            sizeName: null,
            fileName: null,
            key: null,
        }, alreadyEncrypted, ['id', 'url', 'sizeName']);
    }
    decrypt(orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            const view = yield this.decryptObj(new attachmentView_1.AttachmentView(this), {
                fileName: null,
            }, orgId);
            if (this.key != null) {
                let cryptoService;
                const containerService = utils_1.Utils.global.bitwardenContainerService;
                if (containerService) {
                    cryptoService = containerService.getCryptoService();
                }
                else {
                    throw new Error('global bitwardenContainerService not initialized.');
                }
                try {
                    const orgKey = yield cryptoService.getOrgKey(orgId);
                    const decValue = yield cryptoService.decryptToBytes(this.key, orgKey);
                    view.key = new symmetricCryptoKey_1.SymmetricCryptoKey(decValue);
                }
                catch (e) {
                    // TODO: error?
                }
            }
            return view;
        });
    }
    toAttachmentData() {
        const a = new attachmentData_1.AttachmentData();
        a.size = this.size;
        this.buildDataModel(this, a, {
            id: null,
            url: null,
            sizeName: null,
            fileName: null,
            key: null,
        }, ['id', 'url', 'sizeName']);
        return a;
    }
}
exports.Attachment = Attachment;
//# sourceMappingURL=attachment.js.map