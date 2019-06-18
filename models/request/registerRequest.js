"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RegisterRequest {
    constructor(email, name, masterPasswordHash, masterPasswordHint, key, kdf, kdfIterations) {
        this.name = name;
        this.email = email;
        this.masterPasswordHash = masterPasswordHash;
        this.masterPasswordHint = masterPasswordHint ? masterPasswordHint : null;
        this.key = key;
        this.kdf = kdf;
        this.kdfIterations = kdfIterations;
    }
}
exports.RegisterRequest = RegisterRequest;
//# sourceMappingURL=registerRequest.js.map