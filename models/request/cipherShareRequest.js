"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cipherRequest_1 = require("./cipherRequest");
class CipherShareRequest {
    constructor(cipher) {
        this.cipher = new cipherRequest_1.CipherRequest(cipher);
        this.collectionIds = cipher.collectionIds;
    }
}
exports.CipherShareRequest = CipherShareRequest;
//# sourceMappingURL=cipherShareRequest.js.map