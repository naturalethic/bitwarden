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
const forge = require("node-forge");
const utils_1 = require("../misc/utils");
const decryptParameters_1 = require("../models/domain/decryptParameters");
class WebCryptoFunctionService {
    constructor(win, platformUtilsService) {
        this.win = win;
        this.platformUtilsService = platformUtilsService;
        this.crypto = typeof win.crypto !== 'undefined' ? win.crypto : null;
        this.subtle = (!!this.crypto && typeof win.crypto.subtle !== 'undefined') ? win.crypto.subtle : null;
        this.isEdge = platformUtilsService.isEdge();
        this.isIE = platformUtilsService.isIE();
        const ua = win.navigator.userAgent;
        this.isOldSafari = platformUtilsService.isSafari() &&
            (ua.indexOf(' Version/10.') > -1 || ua.indexOf(' Version/9.') > -1);
    }
    pbkdf2(password, salt, algorithm, iterations) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isEdge || this.isIE || this.isOldSafari) {
                const forgeLen = algorithm === 'sha256' ? 32 : 64;
                const passwordBytes = this.toByteString(password);
                const saltBytes = this.toByteString(salt);
                const derivedKeyBytes = forge.pbkdf2(passwordBytes, saltBytes, iterations, forgeLen, algorithm);
                return utils_1.Utils.fromByteStringToArray(derivedKeyBytes).buffer;
            }
            const wcLen = algorithm === 'sha256' ? 256 : 512;
            const passwordBuf = this.toBuf(password);
            const saltBuf = this.toBuf(salt);
            const pbkdf2Params = {
                name: 'PBKDF2',
                salt: saltBuf,
                iterations: iterations,
                hash: { name: this.toWebCryptoAlgorithm(algorithm) },
            };
            const impKey = yield this.subtle.importKey('raw', passwordBuf, { name: 'PBKDF2' }, false, ['deriveBits']);
            return yield this.subtle.deriveBits(pbkdf2Params, impKey, wcLen);
        });
    }
    hash(value, algorithm) {
        return __awaiter(this, void 0, void 0, function* () {
            if (((this.isEdge || this.isIE) && algorithm === 'sha1') || algorithm === 'md5') {
                const md = algorithm === 'md5' ? forge.md.md5.create() : forge.md.sha1.create();
                const valueBytes = this.toByteString(value);
                md.update(valueBytes, 'raw');
                return utils_1.Utils.fromByteStringToArray(md.digest().data).buffer;
            }
            const valueBuf = this.toBuf(value);
            return yield this.subtle.digest({ name: this.toWebCryptoAlgorithm(algorithm) }, valueBuf);
        });
    }
    hmac(value, key, algorithm) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isIE && algorithm === 'sha512') {
                const hmac = forge.hmac.create();
                const keyBytes = this.toByteString(key);
                const valueBytes = this.toByteString(value);
                hmac.start(algorithm, keyBytes);
                hmac.update(valueBytes, 'raw');
                return utils_1.Utils.fromByteStringToArray(hmac.digest().data).buffer;
            }
            const signingAlgorithm = {
                name: 'HMAC',
                hash: { name: this.toWebCryptoAlgorithm(algorithm) },
            };
            const impKey = yield this.subtle.importKey('raw', key, signingAlgorithm, false, ['sign']);
            return yield this.subtle.sign(signingAlgorithm, impKey, value);
        });
    }
    // Safely compare two values in a way that protects against timing attacks (Double HMAC Verification).
    // ref: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/february/double-hmac-verification/
    // ref: https://paragonie.com/blog/2015/11/preventing-timing-attacks-on-string-comparison-with-double-hmac-strategy
    compare(a, b) {
        return __awaiter(this, void 0, void 0, function* () {
            const macKey = yield this.randomBytes(32);
            const signingAlgorithm = {
                name: 'HMAC',
                hash: { name: 'SHA-256' },
            };
            const impKey = yield this.subtle.importKey('raw', macKey, signingAlgorithm, false, ['sign']);
            const mac1 = yield this.subtle.sign(signingAlgorithm, impKey, a);
            const mac2 = yield this.subtle.sign(signingAlgorithm, impKey, b);
            if (mac1.byteLength !== mac2.byteLength) {
                return false;
            }
            const arr1 = new Uint8Array(mac1);
            const arr2 = new Uint8Array(mac2);
            for (let i = 0; i < arr2.length; i++) {
                if (arr1[i] !== arr2[i]) {
                    return false;
                }
            }
            return true;
        });
    }
    hmacFast(value, key, algorithm) {
        const hmac = forge.hmac.create();
        hmac.start(algorithm, key);
        hmac.update(value);
        const bytes = hmac.digest().getBytes();
        return Promise.resolve(bytes);
    }
    compareFast(a, b) {
        return __awaiter(this, void 0, void 0, function* () {
            const rand = yield this.randomBytes(32);
            const bytes = new Uint32Array(rand);
            const buffer = forge.util.createBuffer();
            for (let i = 0; i < bytes.length; i++) {
                buffer.putInt32(bytes[i]);
            }
            const macKey = buffer.getBytes();
            const hmac = forge.hmac.create();
            hmac.start('sha256', macKey);
            hmac.update(a);
            const mac1 = hmac.digest().getBytes();
            hmac.start(null, null);
            hmac.update(b);
            const mac2 = hmac.digest().getBytes();
            const equals = mac1 === mac2;
            return equals;
        });
    }
    aesEncrypt(data, iv, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const impKey = yield this.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['encrypt']);
            return yield this.subtle.encrypt({ name: 'AES-CBC', iv: iv }, impKey, data);
        });
    }
    aesDecryptFastParameters(data, iv, mac, key) {
        const p = new decryptParameters_1.DecryptParameters();
        if (key.meta != null) {
            p.encKey = key.meta.encKeyByteString;
            p.macKey = key.meta.macKeyByteString;
        }
        if (p.encKey == null) {
            p.encKey = forge.util.decode64(key.encKeyB64);
        }
        p.data = forge.util.decode64(data);
        p.iv = forge.util.decode64(iv);
        p.macData = p.iv + p.data;
        if (p.macKey == null && key.macKeyB64 != null) {
            p.macKey = forge.util.decode64(key.macKeyB64);
        }
        if (mac != null) {
            p.mac = forge.util.decode64(mac);
        }
        // cache byte string keys for later
        if (key.meta == null) {
            key.meta = {};
        }
        if (key.meta.encKeyByteString == null) {
            key.meta.encKeyByteString = p.encKey;
        }
        if (p.macKey != null && key.meta.macKeyByteString == null) {
            key.meta.macKeyByteString = p.macKey;
        }
        return p;
    }
    aesDecryptFast(parameters) {
        const dataBuffer = forge.util.createBuffer(parameters.data);
        const decipher = forge.cipher.createDecipher('AES-CBC', parameters.encKey);
        decipher.start({ iv: parameters.iv });
        decipher.update(dataBuffer);
        decipher.finish();
        const val = decipher.output.toString('utf8');
        return Promise.resolve(val);
    }
    aesDecrypt(data, iv, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const impKey = yield this.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['decrypt']);
            return yield this.subtle.decrypt({ name: 'AES-CBC', iv: iv }, impKey, data);
        });
    }
    rsaEncrypt(data, publicKey, algorithm) {
        return __awaiter(this, void 0, void 0, function* () {
            // Note: Edge browser requires that we specify name and hash for both key import and decrypt.
            // We cannot use the proper types here.
            const rsaParams = {
                name: 'RSA-OAEP',
                hash: { name: this.toWebCryptoAlgorithm(algorithm) },
            };
            const impKey = yield this.subtle.importKey('spki', publicKey, rsaParams, false, ['encrypt']);
            return yield this.subtle.encrypt(rsaParams, impKey, data);
        });
    }
    rsaDecrypt(data, privateKey, algorithm) {
        return __awaiter(this, void 0, void 0, function* () {
            // Note: Edge browser requires that we specify name and hash for both key import and decrypt.
            // We cannot use the proper types here.
            const rsaParams = {
                name: 'RSA-OAEP',
                hash: { name: this.toWebCryptoAlgorithm(algorithm) },
            };
            const impKey = yield this.subtle.importKey('pkcs8', privateKey, rsaParams, false, ['decrypt']);
            return yield this.subtle.decrypt(rsaParams, impKey, data);
        });
    }
    rsaExtractPublicKey(privateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const rsaParams = {
                name: 'RSA-OAEP',
                // Have to specify some algorithm
                hash: { name: this.toWebCryptoAlgorithm('sha1') },
            };
            const impPrivateKey = yield this.subtle.importKey('pkcs8', privateKey, rsaParams, true, ['decrypt']);
            const jwkPrivateKey = yield this.subtle.exportKey('jwk', impPrivateKey);
            const jwkPublicKeyParams = {
                kty: 'RSA',
                e: jwkPrivateKey.e,
                n: jwkPrivateKey.n,
                alg: 'RSA-OAEP',
                ext: true,
            };
            const impPublicKey = yield this.subtle.importKey('jwk', jwkPublicKeyParams, rsaParams, true, ['encrypt']);
            return yield this.subtle.exportKey('spki', impPublicKey);
        });
    }
    rsaGenerateKeyPair(length) {
        return __awaiter(this, void 0, void 0, function* () {
            const rsaParams = {
                name: 'RSA-OAEP',
                modulusLength: length,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                // Have to specify some algorithm
                hash: { name: this.toWebCryptoAlgorithm('sha1') },
            };
            const keyPair = yield this.subtle.generateKey(rsaParams, true, ['encrypt', 'decrypt']);
            const publicKey = yield this.subtle.exportKey('spki', keyPair.publicKey);
            const privateKey = yield this.subtle.exportKey('pkcs8', keyPair.privateKey);
            return [publicKey, privateKey];
        });
    }
    randomBytes(length) {
        const arr = new Uint8Array(length);
        this.crypto.getRandomValues(arr);
        return Promise.resolve(arr.buffer);
    }
    toBuf(value) {
        let buf;
        if (typeof (value) === 'string') {
            buf = utils_1.Utils.fromUtf8ToArray(value).buffer;
        }
        else {
            buf = value;
        }
        return buf;
    }
    toByteString(value) {
        let bytes;
        if (typeof (value) === 'string') {
            bytes = forge.util.encodeUtf8(value);
        }
        else {
            bytes = utils_1.Utils.fromBufferToByteString(value);
        }
        return bytes;
    }
    toWebCryptoAlgorithm(algorithm) {
        if (algorithm === 'md5') {
            throw new Error('MD5 is not supported in WebCrypto.');
        }
        return algorithm === 'sha1' ? 'SHA-1' : algorithm === 'sha256' ? 'SHA-256' : 'SHA-512';
    }
}
exports.WebCryptoFunctionService = WebCryptoFunctionService;
//# sourceMappingURL=webCryptoFunction.service.js.map