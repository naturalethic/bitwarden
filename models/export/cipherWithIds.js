"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cipher_1 = require("./cipher");
class CipherWithIds extends cipher_1.Cipher {
    // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
    build(o) {
        this.id = o.id;
        super.build(o);
        this.collectionIds = o.collectionIds;
    }
}
exports.CipherWithIds = CipherWithIds;
//# sourceMappingURL=cipherWithIds.js.map