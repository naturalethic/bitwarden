"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cipherRequest_1 = require("./cipherRequest");
class CipherWithIdRequest extends cipherRequest_1.CipherRequest {
    constructor(cipher) {
        super(cipher);
        this.id = cipher.id;
    }
}
exports.CipherWithIdRequest = CipherWithIdRequest;
//# sourceMappingURL=cipherWithIdRequest.js.map