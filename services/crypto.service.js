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
const bigInt = require("big-integer");
const encryptionType_1 = require("../enums/encryptionType");
const kdfType_1 = require("../enums/kdfType");
const cipherString_1 = require("../models/domain/cipherString");
const encryptedObject_1 = require("../models/domain/encryptedObject");
const symmetricCryptoKey_1 = require("../models/domain/symmetricCryptoKey");
const constants_service_1 = require("./constants.service");
const sequentialize_1 = require("../misc/sequentialize");
const utils_1 = require("../misc/utils");
const wordlist_1 = require("../misc/wordlist");
const Keys = {
    key: 'key',
    encOrgKeys: 'encOrgKeys',
    encPrivateKey: 'encPrivateKey',
    encKey: 'encKey',
    keyHash: 'keyHash',
};
class CryptoService {
    constructor(storageService, secureStorageService, cryptoFunctionService) {
        this.storageService = storageService;
        this.secureStorageService = secureStorageService;
        this.cryptoFunctionService = cryptoFunctionService;
    }
    setKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.key = key;
            const option = yield this.storageService.get(constants_service_1.ConstantsService.lockOptionKey);
            if (option != null) {
                // if we have a lock option set, we do not store the key
                return;
            }
            return this.secureStorageService.save(Keys.key, key.keyB64);
        });
    }
    setKeyHash(keyHash) {
        this.keyHash = keyHash;
        return this.storageService.save(Keys.keyHash, keyHash);
    }
    setEncKey(encKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (encKey == null) {
                return;
            }
            yield this.storageService.save(Keys.encKey, encKey);
            this.encKey = null;
        });
    }
    setEncPrivateKey(encPrivateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (encPrivateKey == null) {
                return;
            }
            yield this.storageService.save(Keys.encPrivateKey, encPrivateKey);
            this.privateKey = null;
        });
    }
    setOrgKeys(orgs) {
        const orgKeys = {};
        orgs.forEach((org) => {
            orgKeys[org.id] = org.key;
        });
        this.orgKeys = null;
        return this.storageService.save(Keys.encOrgKeys, orgKeys);
    }
    getKey() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.key != null) {
                return this.key;
            }
            const key = yield this.secureStorageService.get(Keys.key);
            if (key != null) {
                this.key = new symmetricCryptoKey_1.SymmetricCryptoKey(utils_1.Utils.fromB64ToArray(key).buffer);
            }
            return key == null ? null : this.key;
        });
    }
    getKeyHash() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.keyHash != null) {
                return this.keyHash;
            }
            const keyHash = yield this.storageService.get(Keys.keyHash);
            if (keyHash != null) {
                this.keyHash = keyHash;
            }
            return keyHash == null ? null : this.keyHash;
        });
    }
    getEncKey() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.encKey != null) {
                return this.encKey;
            }
            const encKey = yield this.storageService.get(Keys.encKey);
            if (encKey == null) {
                return null;
            }
            const key = yield this.getKey();
            if (key == null) {
                return null;
            }
            let decEncKey;
            const encKeyCipher = new cipherString_1.CipherString(encKey);
            if (encKeyCipher.encryptionType === encryptionType_1.EncryptionType.AesCbc256_B64) {
                decEncKey = yield this.decryptToBytes(encKeyCipher, key);
            }
            else if (encKeyCipher.encryptionType === encryptionType_1.EncryptionType.AesCbc256_HmacSha256_B64) {
                const newKey = yield this.stretchKey(key);
                decEncKey = yield this.decryptToBytes(encKeyCipher, newKey);
            }
            else {
                throw new Error('Unsupported encKey type.');
            }
            if (decEncKey == null) {
                return null;
            }
            this.encKey = new symmetricCryptoKey_1.SymmetricCryptoKey(decEncKey);
            return this.encKey;
        });
    }
    getPublicKey() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.publicKey != null) {
                return this.publicKey;
            }
            const privateKey = yield this.getPrivateKey();
            if (privateKey == null) {
                return null;
            }
            this.publicKey = yield this.cryptoFunctionService.rsaExtractPublicKey(privateKey);
            return this.publicKey;
        });
    }
    getPrivateKey() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.privateKey != null) {
                return this.privateKey;
            }
            const encPrivateKey = yield this.storageService.get(Keys.encPrivateKey);
            if (encPrivateKey == null) {
                return null;
            }
            this.privateKey = yield this.decryptToBytes(new cipherString_1.CipherString(encPrivateKey), null);
            return this.privateKey;
        });
    }
    getFingerprint(userId, publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (publicKey == null) {
                publicKey = yield this.getPublicKey();
            }
            if (publicKey === null) {
                throw new Error('No public key available.');
            }
            const keyFingerprint = yield this.cryptoFunctionService.hash(publicKey, 'sha256');
            const userFingerprint = yield this.hkdfExpand(keyFingerprint, utils_1.Utils.fromUtf8ToArray(userId), 32);
            return this.hashPhrase(userFingerprint.buffer);
        });
    }
    getOrgKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.orgKeys != null && this.orgKeys.size > 0) {
                return this.orgKeys;
            }
            const encOrgKeys = yield this.storageService.get(Keys.encOrgKeys);
            if (encOrgKeys == null) {
                return null;
            }
            const orgKeys = new Map();
            let setKey = false;
            for (const orgId in encOrgKeys) {
                if (!encOrgKeys.hasOwnProperty(orgId)) {
                    continue;
                }
                const decValue = yield this.rsaDecrypt(encOrgKeys[orgId]);
                orgKeys.set(orgId, new symmetricCryptoKey_1.SymmetricCryptoKey(decValue));
                setKey = true;
            }
            if (setKey) {
                this.orgKeys = orgKeys;
            }
            return this.orgKeys;
        });
    }
    getOrgKey(orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (orgId == null) {
                return null;
            }
            const orgKeys = yield this.getOrgKeys();
            if (orgKeys == null || !orgKeys.has(orgId)) {
                return null;
            }
            return orgKeys.get(orgId);
        });
    }
    hasKey() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getKey()) != null;
        });
    }
    hasEncKey() {
        return __awaiter(this, void 0, void 0, function* () {
            const encKey = yield this.storageService.get(Keys.encKey);
            return encKey != null;
        });
    }
    clearKey() {
        this.key = this.legacyEtmKey = null;
        return this.secureStorageService.remove(Keys.key);
    }
    clearKeyHash() {
        this.keyHash = null;
        return this.storageService.remove(Keys.keyHash);
    }
    clearEncKey(memoryOnly) {
        this.encKey = null;
        if (memoryOnly) {
            return Promise.resolve();
        }
        return this.storageService.remove(Keys.encKey);
    }
    clearKeyPair(memoryOnly) {
        this.privateKey = null;
        this.publicKey = null;
        if (memoryOnly) {
            return Promise.resolve();
        }
        return this.storageService.remove(Keys.encPrivateKey);
    }
    clearOrgKeys(memoryOnly) {
        this.orgKeys = null;
        if (memoryOnly) {
            return Promise.resolve();
        }
        return this.storageService.remove(Keys.encOrgKeys);
    }
    clearPinProtectedKey() {
        return this.storageService.remove(constants_service_1.ConstantsService.pinProtectedKey);
    }
    clearKeys() {
        return Promise.all([
            this.clearKey(),
            this.clearKeyHash(),
            this.clearOrgKeys(),
            this.clearEncKey(),
            this.clearKeyPair(),
            this.clearPinProtectedKey(),
        ]);
    }
    toggleKey() {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.getKey();
            const option = yield this.storageService.get(constants_service_1.ConstantsService.lockOptionKey);
            if (option != null || option === 0) {
                // if we have a lock option set, clear the key
                yield this.clearKey();
                this.key = key;
                return;
            }
            yield this.setKey(key);
        });
    }
    makeKey(password, salt, kdf, kdfIterations) {
        return __awaiter(this, void 0, void 0, function* () {
            let key = null;
            if (kdf == null || kdf === kdfType_1.KdfType.PBKDF2_SHA256) {
                if (kdfIterations == null) {
                    kdfIterations = 5000;
                }
                else if (kdfIterations < 5000) {
                    throw new Error('PBKDF2 iteration minimum is 5000.');
                }
                key = yield this.cryptoFunctionService.pbkdf2(password, salt, 'sha256', kdfIterations);
            }
            else {
                throw new Error('Unknown Kdf.');
            }
            return new symmetricCryptoKey_1.SymmetricCryptoKey(key);
        });
    }
    makeKeyFromPin(pin, salt, kdf, kdfIterations) {
        return __awaiter(this, void 0, void 0, function* () {
            const pinProtectedKey = yield this.storageService.get(constants_service_1.ConstantsService.pinProtectedKey);
            if (pinProtectedKey == null) {
                throw new Error('No PIN protected key found.');
            }
            const protectedKeyCs = new cipherString_1.CipherString(pinProtectedKey);
            const pinKey = yield this.makePinKey(pin, salt, kdf, kdfIterations);
            const decKey = yield this.decryptToBytes(protectedKeyCs, pinKey);
            return new symmetricCryptoKey_1.SymmetricCryptoKey(decKey);
        });
    }
    makeShareKey() {
        return __awaiter(this, void 0, void 0, function* () {
            const shareKey = yield this.cryptoFunctionService.randomBytes(64);
            const publicKey = yield this.getPublicKey();
            const encShareKey = yield this.rsaEncrypt(shareKey, publicKey);
            return [encShareKey, new symmetricCryptoKey_1.SymmetricCryptoKey(shareKey)];
        });
    }
    makeKeyPair(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyPair = yield this.cryptoFunctionService.rsaGenerateKeyPair(2048);
            const publicB64 = utils_1.Utils.fromBufferToB64(keyPair[0]);
            const privateEnc = yield this.encrypt(keyPair[1], key);
            return [publicB64, privateEnc];
        });
    }
    makePinKey(pin, salt, kdf, kdfIterations) {
        return __awaiter(this, void 0, void 0, function* () {
            const pinKey = yield this.makeKey(pin, salt, kdf, kdfIterations);
            return yield this.stretchKey(pinKey);
        });
    }
    hashPassword(password, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key == null) {
                key = yield this.getKey();
            }
            if (password == null || key == null) {
                throw new Error('Invalid parameters.');
            }
            const hash = yield this.cryptoFunctionService.pbkdf2(key.key, password, 'sha256', 1);
            return utils_1.Utils.fromBufferToB64(hash);
        });
    }
    makeEncKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const theKey = yield this.getKeyForEncryption(key);
            const encKey = yield this.cryptoFunctionService.randomBytes(64);
            return this.buildEncKey(theKey, encKey);
        });
    }
    remakeEncKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const encKey = yield this.getEncKey();
            return this.buildEncKey(key, encKey.key);
        });
    }
    encrypt(plainValue, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (plainValue == null) {
                return Promise.resolve(null);
            }
            let plainBuf;
            if (typeof (plainValue) === 'string') {
                plainBuf = utils_1.Utils.fromUtf8ToArray(plainValue).buffer;
            }
            else {
                plainBuf = plainValue;
            }
            const encObj = yield this.aesEncrypt(plainBuf, key);
            const iv = utils_1.Utils.fromBufferToB64(encObj.iv);
            const data = utils_1.Utils.fromBufferToB64(encObj.data);
            const mac = encObj.mac != null ? utils_1.Utils.fromBufferToB64(encObj.mac) : null;
            return new cipherString_1.CipherString(encObj.key.encType, data, iv, mac);
        });
    }
    encryptToBytes(plainValue, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const encValue = yield this.aesEncrypt(plainValue, key);
            let macLen = 0;
            if (encValue.mac != null) {
                macLen = encValue.mac.byteLength;
            }
            const encBytes = new Uint8Array(1 + encValue.iv.byteLength + macLen + encValue.data.byteLength);
            encBytes.set([encValue.key.encType]);
            encBytes.set(new Uint8Array(encValue.iv), 1);
            if (encValue.mac != null) {
                encBytes.set(new Uint8Array(encValue.mac), 1 + encValue.iv.byteLength);
            }
            encBytes.set(new Uint8Array(encValue.data), 1 + encValue.iv.byteLength + macLen);
            return encBytes.buffer;
        });
    }
    rsaEncrypt(data, publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (publicKey == null) {
                publicKey = yield this.getPublicKey();
            }
            if (publicKey == null) {
                throw new Error('Public key unavailable.');
            }
            const encBytes = yield this.cryptoFunctionService.rsaEncrypt(data, publicKey, 'sha1');
            return new cipherString_1.CipherString(encryptionType_1.EncryptionType.Rsa2048_OaepSha1_B64, utils_1.Utils.fromBufferToB64(encBytes));
        });
    }
    decryptToBytes(cipherString, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const iv = utils_1.Utils.fromB64ToArray(cipherString.iv).buffer;
            const data = utils_1.Utils.fromB64ToArray(cipherString.data).buffer;
            const mac = cipherString.mac ? utils_1.Utils.fromB64ToArray(cipherString.mac).buffer : null;
            const decipher = yield this.aesDecryptToBytes(cipherString.encryptionType, data, iv, mac, key);
            if (decipher == null) {
                return null;
            }
            return decipher;
        });
    }
    decryptToUtf8(cipherString, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.aesDecryptToUtf8(cipherString.encryptionType, cipherString.data, cipherString.iv, cipherString.mac, key);
        });
    }
    decryptFromBytes(encBuf, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (encBuf == null) {
                throw new Error('no encBuf.');
            }
            const encBytes = new Uint8Array(encBuf);
            const encType = encBytes[0];
            let ctBytes = null;
            let ivBytes = null;
            let macBytes = null;
            switch (encType) {
                case encryptionType_1.EncryptionType.AesCbc128_HmacSha256_B64:
                case encryptionType_1.EncryptionType.AesCbc256_HmacSha256_B64:
                    if (encBytes.length <= 49) { // 1 + 16 + 32 + ctLength
                        return null;
                    }
                    ivBytes = encBytes.slice(1, 17);
                    macBytes = encBytes.slice(17, 49);
                    ctBytes = encBytes.slice(49);
                    break;
                case encryptionType_1.EncryptionType.AesCbc256_B64:
                    if (encBytes.length <= 17) { // 1 + 16 + ctLength
                        return null;
                    }
                    ivBytes = encBytes.slice(1, 17);
                    ctBytes = encBytes.slice(17);
                    break;
                default:
                    return null;
            }
            return yield this.aesDecryptToBytes(encType, ctBytes.buffer, ivBytes.buffer, macBytes != null ? macBytes.buffer : null, key);
        });
    }
    // EFForg/OpenWireless
    // ref https://github.com/EFForg/OpenWireless/blob/master/app/js/diceware.js
    randomNumber(min, max) {
        return __awaiter(this, void 0, void 0, function* () {
            let rval = 0;
            const range = max - min + 1;
            const bitsNeeded = Math.ceil(Math.log2(range));
            if (bitsNeeded > 53) {
                throw new Error('We cannot generate numbers larger than 53 bits.');
            }
            const bytesNeeded = Math.ceil(bitsNeeded / 8);
            const mask = Math.pow(2, bitsNeeded) - 1;
            // 7776 -> (2^13 = 8192) -1 == 8191 or 0x00001111 11111111
            // Fill a byte array with N random numbers
            const byteArray = new Uint8Array(yield this.cryptoFunctionService.randomBytes(bytesNeeded));
            let p = (bytesNeeded - 1) * 8;
            for (let i = 0; i < bytesNeeded; i++) {
                rval += byteArray[i] * Math.pow(2, p);
                p -= 8;
            }
            // Use & to apply the mask and reduce the number of recursive lookups
            // tslint:disable-next-line
            rval = rval & mask;
            if (rval >= range) {
                // Integer out of acceptable range
                return this.randomNumber(min, max);
            }
            // Return an integer that falls within the range
            return min + rval;
        });
    }
    // Helpers
    aesEncrypt(data, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = new encryptedObject_1.EncryptedObject();
            obj.key = yield this.getKeyForEncryption(key);
            obj.iv = yield this.cryptoFunctionService.randomBytes(16);
            obj.data = yield this.cryptoFunctionService.aesEncrypt(data, obj.iv, obj.key.encKey);
            if (obj.key.macKey != null) {
                const macData = new Uint8Array(obj.iv.byteLength + obj.data.byteLength);
                macData.set(new Uint8Array(obj.iv), 0);
                macData.set(new Uint8Array(obj.data), obj.iv.byteLength);
                obj.mac = yield this.cryptoFunctionService.hmac(macData.buffer, obj.key.macKey, 'sha256');
            }
            return obj;
        });
    }
    aesDecryptToUtf8(encType, data, iv, mac, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyForEnc = yield this.getKeyForEncryption(key);
            const theKey = this.resolveLegacyKey(encType, keyForEnc);
            if (theKey.macKey != null && mac == null) {
                // tslint:disable-next-line
                console.error('mac required.');
                return null;
            }
            if (theKey.encType !== encType) {
                // tslint:disable-next-line
                console.error('encType unavailable.');
                return null;
            }
            const fastParams = this.cryptoFunctionService.aesDecryptFastParameters(data, iv, mac, theKey);
            if (fastParams.macKey != null && fastParams.mac != null) {
                const computedMac = yield this.cryptoFunctionService.hmacFast(fastParams.macData, fastParams.macKey, 'sha256');
                const macsEqual = yield this.cryptoFunctionService.compareFast(fastParams.mac, computedMac);
                if (!macsEqual) {
                    // tslint:disable-next-line
                    console.error('mac failed.');
                    return null;
                }
            }
            return this.cryptoFunctionService.aesDecryptFast(fastParams);
        });
    }
    aesDecryptToBytes(encType, data, iv, mac, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyForEnc = yield this.getKeyForEncryption(key);
            const theKey = this.resolveLegacyKey(encType, keyForEnc);
            if (theKey.macKey != null && mac == null) {
                return null;
            }
            if (theKey.encType !== encType) {
                return null;
            }
            if (theKey.macKey != null && mac != null) {
                const macData = new Uint8Array(iv.byteLength + data.byteLength);
                macData.set(new Uint8Array(iv), 0);
                macData.set(new Uint8Array(data), iv.byteLength);
                const computedMac = yield this.cryptoFunctionService.hmac(macData.buffer, theKey.macKey, 'sha256');
                if (computedMac === null) {
                    return null;
                }
                const macsMatch = yield this.cryptoFunctionService.compare(mac, computedMac);
                if (!macsMatch) {
                    // tslint:disable-next-line
                    console.error('mac failed.');
                    return null;
                }
            }
            return yield this.cryptoFunctionService.aesDecrypt(data, iv, theKey.encKey);
        });
    }
    rsaDecrypt(encValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const headerPieces = encValue.split('.');
            let encType = null;
            let encPieces;
            if (headerPieces.length === 1) {
                encType = encryptionType_1.EncryptionType.Rsa2048_OaepSha256_B64;
                encPieces = [headerPieces[0]];
            }
            else if (headerPieces.length === 2) {
                try {
                    encType = parseInt(headerPieces[0], null);
                    encPieces = headerPieces[1].split('|');
                }
                catch (e) { }
            }
            switch (encType) {
                case encryptionType_1.EncryptionType.Rsa2048_OaepSha256_B64:
                case encryptionType_1.EncryptionType.Rsa2048_OaepSha1_B64:
                // HmacSha256 types are deprecated
                case encryptionType_1.EncryptionType.Rsa2048_OaepSha256_HmacSha256_B64:
                case encryptionType_1.EncryptionType.Rsa2048_OaepSha1_HmacSha256_B64:
                    break;
                default:
                    throw new Error('encType unavailable.');
            }
            if (encPieces == null || encPieces.length <= 0) {
                throw new Error('encPieces unavailable.');
            }
            const data = utils_1.Utils.fromB64ToArray(encPieces[0]).buffer;
            const privateKey = yield this.getPrivateKey();
            if (privateKey == null) {
                throw new Error('No private key.');
            }
            let alg = 'sha1';
            switch (encType) {
                case encryptionType_1.EncryptionType.Rsa2048_OaepSha256_B64:
                case encryptionType_1.EncryptionType.Rsa2048_OaepSha256_HmacSha256_B64:
                    alg = 'sha256';
                    break;
                case encryptionType_1.EncryptionType.Rsa2048_OaepSha1_B64:
                case encryptionType_1.EncryptionType.Rsa2048_OaepSha1_HmacSha256_B64:
                    break;
                default:
                    throw new Error('encType unavailable.');
            }
            return this.cryptoFunctionService.rsaDecrypt(data, privateKey, alg);
        });
    }
    getKeyForEncryption(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key != null) {
                return key;
            }
            const encKey = yield this.getEncKey();
            if (encKey != null) {
                return encKey;
            }
            return yield this.getKey();
        });
    }
    resolveLegacyKey(encType, key) {
        if (encType === encryptionType_1.EncryptionType.AesCbc128_HmacSha256_B64 &&
            key.encType === encryptionType_1.EncryptionType.AesCbc256_B64) {
            // Old encrypt-then-mac scheme, make a new key
            if (this.legacyEtmKey == null) {
                this.legacyEtmKey = new symmetricCryptoKey_1.SymmetricCryptoKey(key.key, encryptionType_1.EncryptionType.AesCbc128_HmacSha256_B64);
            }
            return this.legacyEtmKey;
        }
        return key;
    }
    stretchKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const newKey = new Uint8Array(64);
            newKey.set(yield this.hkdfExpand(key.key, utils_1.Utils.fromUtf8ToArray('enc'), 32));
            newKey.set(yield this.hkdfExpand(key.key, utils_1.Utils.fromUtf8ToArray('mac'), 32), 32);
            return new symmetricCryptoKey_1.SymmetricCryptoKey(newKey.buffer);
        });
    }
    // ref: https://tools.ietf.org/html/rfc5869
    hkdfExpand(prk, info, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashLen = 32; // sha256
            const okm = new Uint8Array(size);
            let previousT = new Uint8Array(0);
            const n = Math.ceil(size / hashLen);
            for (let i = 0; i < n; i++) {
                const t = new Uint8Array(previousT.length + info.length + 1);
                t.set(previousT);
                t.set(info, previousT.length);
                t.set([i + 1], t.length - 1);
                previousT = new Uint8Array(yield this.cryptoFunctionService.hmac(t.buffer, prk, 'sha256'));
                okm.set(previousT, i * hashLen);
            }
            return okm;
        });
    }
    hashPhrase(hash, minimumEntropy = 64) {
        return __awaiter(this, void 0, void 0, function* () {
            const entropyPerWord = Math.log(wordlist_1.EEFLongWordList.length) / Math.log(2);
            let numWords = Math.ceil(minimumEntropy / entropyPerWord);
            const hashArr = Array.from(new Uint8Array(hash));
            const entropyAvailable = hashArr.length * 4;
            if (numWords * entropyPerWord > entropyAvailable) {
                throw new Error('Output entropy of hash function is too small');
            }
            const phrase = [];
            let hashNumber = bigInt.fromArray(hashArr, 256);
            while (numWords--) {
                const remainder = hashNumber.mod(wordlist_1.EEFLongWordList.length);
                hashNumber = hashNumber.divide(wordlist_1.EEFLongWordList.length);
                phrase.push(wordlist_1.EEFLongWordList[remainder]);
            }
            return phrase;
        });
    }
    buildEncKey(key, encKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let encKeyEnc = null;
            if (key.key.byteLength === 32) {
                const newKey = yield this.stretchKey(key);
                encKeyEnc = yield this.encrypt(encKey, newKey);
            }
            else if (key.key.byteLength === 64) {
                encKeyEnc = yield this.encrypt(encKey, key);
            }
            else {
                throw new Error('Invalid key size.');
            }
            return [new symmetricCryptoKey_1.SymmetricCryptoKey(encKey), encKeyEnc];
        });
    }
}
__decorate([
    sequentialize_1.sequentialize(() => 'getEncKey'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CryptoService.prototype, "getEncKey", null);
__decorate([
    sequentialize_1.sequentialize(() => 'getOrgKeys'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CryptoService.prototype, "getOrgKeys", null);
exports.CryptoService = CryptoService;
//# sourceMappingURL=crypto.service.js.map