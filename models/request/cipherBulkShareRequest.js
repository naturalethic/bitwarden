"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cipherWithIdRequest_1 = require("./cipherWithIdRequest");
class CipherBulkShareRequest {
    constructor(ciphers, collectionIds) {
        if (ciphers != null) {
            this.ciphers = [];
            ciphers.forEach((c) => {
                this.ciphers.push(new cipherWithIdRequest_1.CipherWithIdRequest(c));
            });
        }
        this.collectionIds = collectionIds;
    }
}
exports.CipherBulkShareRequest = CipherBulkShareRequest;
//# sourceMappingURL=cipherBulkShareRequest.js.map