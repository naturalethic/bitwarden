"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseResponse_1 = require("./baseResponse");
const cipherResponse_1 = require("./cipherResponse");
const collectionResponse_1 = require("./collectionResponse");
const domainsResponse_1 = require("./domainsResponse");
const folderResponse_1 = require("./folderResponse");
const profileResponse_1 = require("./profileResponse");
class SyncResponse extends baseResponse_1.BaseResponse {
    constructor(response) {
        super(response);
        this.folders = [];
        this.collections = [];
        this.ciphers = [];
        const profile = this.getResponseProperty('Profile');
        if (profile != null) {
            this.profile = new profileResponse_1.ProfileResponse(profile);
        }
        const folders = this.getResponseProperty('Folders');
        if (folders != null) {
            this.folders = folders.map((f) => new folderResponse_1.FolderResponse(f));
        }
        const collections = this.getResponseProperty('Collections');
        if (collections != null) {
            this.collections = collections.map((c) => new collectionResponse_1.CollectionDetailsResponse(c));
        }
        const ciphers = this.getResponseProperty('Ciphers');
        if (ciphers != null) {
            this.ciphers = ciphers.map((c) => new cipherResponse_1.CipherResponse(c));
        }
        const domains = this.getResponseProperty('Domains');
        if (domains != null) {
            this.domains = new domainsResponse_1.DomainsResponse(domains);
        }
    }
}
exports.SyncResponse = SyncResponse;
//# sourceMappingURL=syncResponse.js.map