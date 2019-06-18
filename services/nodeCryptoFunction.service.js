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
const crypto = require("crypto");
const forge = require("node-forge");
const utils_1 = require("../misc/utils");
const decryptParameters_1 = require("../models/domain/decryptParameters");
class NodeCryptoFunctionService {
    pbkdf2(password, salt, algorithm, iterations) {
        const len = algorithm === 'sha256' ? 32 : 64;
        const nodePassword = this.toNodeValue(password);
        const nodeSalt = this.toNodeValue(salt);
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(nodePassword, nodeSalt, iterations, len, algorithm, (error, key) => {
                if (error != null) {
                    reject(error);
                }
                else {
                    resolve(this.toArrayBuffer(key));
                }
            });
        });
    }
    hash(value, algorithm) {
        const nodeValue = this.toNodeValue(value);
        const hash = crypto.createHash(algorithm);
        hash.update(nodeValue);
        return Promise.resolve(this.toArrayBuffer(hash.digest()));
    }
    hmac(value, key, algorithm) {
        const nodeValue = this.toNodeBuffer(value);
        const nodeKey = this.toNodeBuffer(key);
        const hmac = crypto.createHmac(algorithm, nodeKey);
        hmac.update(nodeValue);
        return Promise.resolve(this.toArrayBuffer(hmac.digest()));
    }
    compare(a, b) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.randomBytes(32);
            const mac1 = yield this.hmac(a, key, 'sha256');
            const mac2 = yield this.hmac(b, key, 'sha256');
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
        return this.hmac(value, key, algorithm);
    }
    compareFast(a, b) {
        return this.compare(a, b);
    }
    aesEncrypt(data, iv, key) {
        const nodeData = this.toNodeBuffer(data);
        const nodeIv = this.toNodeBuffer(iv);
        const nodeKey = this.toNodeBuffer(key);
        const cipher = crypto.createCipheriv('aes-256-cbc', nodeKey, nodeIv);
        const encBuf = Buffer.concat([cipher.update(nodeData), cipher.final()]);
        return Promise.resolve(this.toArrayBuffer(encBuf));
    }
    aesDecryptFastParameters(data, iv, mac, key) {
        const p = new decryptParameters_1.DecryptParameters();
        p.encKey = key.encKey;
        p.data = utils_1.Utils.fromB64ToArray(data).buffer;
        p.iv = utils_1.Utils.fromB64ToArray(iv).buffer;
        const macData = new Uint8Array(p.iv.byteLength + p.data.byteLength);
        macData.set(new Uint8Array(p.iv), 0);
        macData.set(new Uint8Array(p.data), p.iv.byteLength);
        p.macData = macData.buffer;
        if (key.macKey != null) {
            p.macKey = key.macKey;
        }
        if (mac != null) {
            p.mac = utils_1.Utils.fromB64ToArray(mac).buffer;
        }
        return p;
    }
    aesDecryptFast(parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            const decBuf = yield this.aesDecrypt(parameters.data, parameters.iv, parameters.encKey);
            return utils_1.Utils.fromBufferToUtf8(decBuf);
        });
    }
    aesDecrypt(data, iv, key) {
        const nodeData = this.toNodeBuffer(data);
        const nodeIv = this.toNodeBuffer(iv);
        const nodeKey = this.toNodeBuffer(key);
        const decipher = crypto.createDecipheriv('aes-256-cbc', nodeKey, nodeIv);
        const decBuf = Buffer.concat([decipher.update(nodeData), decipher.final()]);
        return Promise.resolve(this.toArrayBuffer(decBuf));
    }
    rsaEncrypt(data, publicKey, algorithm) {
        if (algorithm === 'sha256') {
            throw new Error('Node crypto does not support RSA-OAEP SHA-256');
        }
        const pem = this.toPemPublicKey(publicKey);
        const decipher = crypto.publicEncrypt(pem, this.toNodeBuffer(data));
        return Promise.resolve(this.toArrayBuffer(decipher));
    }
    rsaDecrypt(data, privateKey, algorithm) {
        if (algorithm === 'sha256') {
            throw new Error('Node crypto does not support RSA-OAEP SHA-256');
        }
        const pem = this.toPemPrivateKey(privateKey);
        const decipher = crypto.privateDecrypt(pem, this.toNodeBuffer(data));
        return Promise.resolve(this.toArrayBuffer(decipher));
    }
    rsaExtractPublicKey(privateKey) {
        const privateKeyByteString = utils_1.Utils.fromBufferToByteString(privateKey);
        const privateKeyAsn1 = forge.asn1.fromDer(privateKeyByteString);
        const forgePrivateKey = forge.pki.privateKeyFromAsn1(privateKeyAsn1);
        const forgePublicKey = forge.pki.setRsaPublicKey(forgePrivateKey.n, forgePrivateKey.e);
        const publicKeyAsn1 = forge.pki.publicKeyToAsn1(forgePublicKey);
        const publicKeyByteString = forge.asn1.toDer(publicKeyAsn1).data;
        const publicKeyArray = utils_1.Utils.fromByteStringToArray(publicKeyByteString);
        return Promise.resolve(publicKeyArray.buffer);
    }
    rsaGenerateKeyPair(length) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                forge.pki.rsa.generateKeyPair({
                    bits: length,
                    workers: -1,
                    e: 0x10001,
                }, (error, keyPair) => {
                    if (error != null) {
                        reject(error);
                        return;
                    }
                    const publicKeyAsn1 = forge.pki.publicKeyToAsn1(keyPair.publicKey);
                    const publicKeyByteString = forge.asn1.toDer(publicKeyAsn1).getBytes();
                    const publicKey = utils_1.Utils.fromByteStringToArray(publicKeyByteString);
                    const privateKeyAsn1 = forge.pki.privateKeyToAsn1(keyPair.privateKey);
                    const privateKeyPkcs8 = forge.pki.wrapRsaPrivateKey(privateKeyAsn1);
                    const privateKeyByteString = forge.asn1.toDer(privateKeyPkcs8).getBytes();
                    const privateKey = utils_1.Utils.fromByteStringToArray(privateKeyByteString);
                    resolve([publicKey.buffer, privateKey.buffer]);
                });
            });
        });
    }
    randomBytes(length) {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(length, (error, bytes) => {
                if (error != null) {
                    reject(error);
                }
                else {
                    resolve(this.toArrayBuffer(bytes));
                }
            });
        });
    }
    toNodeValue(value) {
        let nodeValue;
        if (typeof (value) === 'string') {
            nodeValue = value;
        }
        else {
            nodeValue = this.toNodeBuffer(value);
        }
        return nodeValue;
    }
    toNodeBuffer(value) {
        return Buffer.from(new Uint8Array(value));
    }
    toArrayBuffer(buf) {
        return new Uint8Array(buf).buffer;
    }
    toPemPrivateKey(key) {
        const byteString = utils_1.Utils.fromBufferToByteString(key);
        const asn1 = forge.asn1.fromDer(byteString);
        const privateKey = forge.pki.privateKeyFromAsn1(asn1);
        const rsaPrivateKey = forge.pki.privateKeyToAsn1(privateKey);
        const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey);
        return forge.pki.privateKeyInfoToPem(privateKeyInfo);
    }
    toPemPublicKey(key) {
        const byteString = utils_1.Utils.fromBufferToByteString(key);
        const asn1 = forge.asn1.fromDer(byteString);
        const publicKey = forge.pki.publicKeyFromAsn1(asn1);
        return forge.pki.publicKeyToPem(publicKey);
    }
}
exports.NodeCryptoFunctionService = NodeCryptoFunctionService;
//# sourceMappingURL=nodeCryptoFunction.service.js.map