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
const encryptionType_1 = require("../../enums/encryptionType");
const utils_1 = require("../../misc/utils");
class CipherString {
    constructor(encryptedStringOrType, data, iv, mac) {
        if (data != null) {
            // data and header
            const encType = encryptedStringOrType;
            if (iv != null) {
                this.encryptedString = encType + '.' + iv + '|' + data;
            }
            else {
                this.encryptedString = encType + '.' + data;
            }
            // mac
            if (mac != null) {
                this.encryptedString += ('|' + mac);
            }
            this.encryptionType = encType;
            this.data = data;
            this.iv = iv;
            this.mac = mac;
            return;
        }
        this.encryptedString = encryptedStringOrType;
        if (!this.encryptedString) {
            return;
        }
        const headerPieces = this.encryptedString.split('.');
        let encPieces = null;
        if (headerPieces.length === 2) {
            try {
                this.encryptionType = parseInt(headerPieces[0], null);
                encPieces = headerPieces[1].split('|');
            }
            catch (e) {
                return;
            }
        }
        else {
            encPieces = this.encryptedString.split('|');
            this.encryptionType = encPieces.length === 3 ? encryptionType_1.EncryptionType.AesCbc128_HmacSha256_B64 :
                encryptionType_1.EncryptionType.AesCbc256_B64;
        }
        switch (this.encryptionType) {
            case encryptionType_1.EncryptionType.AesCbc128_HmacSha256_B64:
            case encryptionType_1.EncryptionType.AesCbc256_HmacSha256_B64:
                if (encPieces.length !== 3) {
                    return;
                }
                this.iv = encPieces[0];
                this.data = encPieces[1];
                this.mac = encPieces[2];
                break;
            case encryptionType_1.EncryptionType.AesCbc256_B64:
                if (encPieces.length !== 2) {
                    return;
                }
                this.iv = encPieces[0];
                this.data = encPieces[1];
                break;
            case encryptionType_1.EncryptionType.Rsa2048_OaepSha256_B64:
            case encryptionType_1.EncryptionType.Rsa2048_OaepSha1_B64:
                if (encPieces.length !== 1) {
                    return;
                }
                this.data = encPieces[0];
                break;
            default:
                return;
        }
    }
    decrypt(orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.decryptedValue != null) {
                return this.decryptedValue;
            }
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
                this.decryptedValue = yield cryptoService.decryptToUtf8(this, orgKey);
            }
            catch (e) {
                this.decryptedValue = '[error: cannot decrypt]';
            }
            return this.decryptedValue;
        });
    }
}
exports.CipherString = CipherString;
//# sourceMappingURL=cipherString.js.map