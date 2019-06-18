var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SymmetricCryptoKey } from '../../models/domain';
import { Utils } from '../../misc/utils';
export class NodeEnvSecureStorageService {
    constructor(storageService, cryptoService) {
        this.storageService = storageService;
        this.cryptoService = cryptoService;
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.storageService.get(this.makeProtectedStorageKey(key));
            if (value == null) {
                return null;
            }
            const obj = yield this.decrypt(value);
            return obj;
        });
    }
    save(key, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof (obj) !== 'string') {
                throw new Error('Only string storage is allowed.');
            }
            const protectedObj = yield this.encrypt(obj);
            yield this.storageService.save(this.makeProtectedStorageKey(key), protectedObj);
        });
    }
    remove(key) {
        return this.storageService.remove(this.makeProtectedStorageKey(key));
    }
    encrypt(plainValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionKey = this.getSessionKey();
            if (sessionKey == null) {
                throw new Error('No session key available.');
            }
            const encValue = yield this.cryptoService().encryptToBytes(Utils.fromB64ToArray(plainValue).buffer, sessionKey);
            if (encValue == null) {
                throw new Error('Value didn\'t encrypt.');
            }
            return Utils.fromBufferToB64(encValue);
        });
    }
    decrypt(encValue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionKey = this.getSessionKey();
                if (sessionKey == null) {
                    return null;
                }
                const decValue = yield this.cryptoService().decryptFromBytes(Utils.fromB64ToArray(encValue).buffer, sessionKey);
                if (decValue == null) {
                    // tslint:disable-next-line
                    console.log('Failed to decrypt.');
                    return null;
                }
                return Utils.fromBufferToB64(decValue);
            }
            catch (e) {
                // tslint:disable-next-line
                console.log('Decrypt error.');
                return null;
            }
        });
    }
    getSessionKey() {
        try {
            if (process.env.BW_SESSION != null) {
                const sessionBuffer = Utils.fromB64ToArray(process.env.BW_SESSION).buffer;
                if (sessionBuffer != null) {
                    const sessionKey = new SymmetricCryptoKey(sessionBuffer);
                    if (sessionBuffer != null) {
                        return sessionKey;
                    }
                }
            }
        }
        catch (e) {
            // tslint:disable-next-line
            console.log('Session key is invalid.');
        }
        return null;
    }
    makeProtectedStorageKey(key) {
        return '__PROTECTED__' + key;
    }
}
//# sourceMappingURL=nodeEnvSecureStorage.service.js.map
