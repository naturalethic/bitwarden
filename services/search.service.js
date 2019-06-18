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
const lunr = require("lunr");
const cipherType_1 = require("../enums/cipherType");
const deviceType_1 = require("../enums/deviceType");
const fieldType_1 = require("../enums/fieldType");
const uriMatchType_1 = require("../enums/uriMatchType");
class SearchService {
    constructor(cipherService, platformUtilsService) {
        this.cipherService = cipherService;
        this.indexing = false;
        this.index = null;
        this.onlySearchName = false;
        this.onlySearchName = platformUtilsService == null ||
            platformUtilsService.getDevice() === deviceType_1.DeviceType.EdgeExtension;
    }
    clearIndex() {
        this.index = null;
    }
    isSearchable(query) {
        const notSearchable = query == null || (this.index == null && query.length < 2) ||
            (this.index != null && query.length < 2 && query.indexOf('>') !== 0);
        return !notSearchable;
    }
    indexCiphers() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.indexing) {
                return;
            }
            // tslint:disable-next-line
            console.time('search indexing');
            this.indexing = true;
            this.index = null;
            const builder = new lunr.Builder();
            builder.ref('id');
            builder.field('shortid', { boost: 100, extractor: (c) => c.id.substr(0, 8) });
            builder.field('name', { boost: 10 });
            builder.field('subtitle', {
                boost: 5,
                extractor: (c) => {
                    if (c.subTitle != null && c.type === cipherType_1.CipherType.Card) {
                        return c.subTitle.replace(/\*/g, '');
                    }
                    return c.subTitle;
                },
            });
            builder.field('notes');
            builder.field('login.username', {
                extractor: (c) => c.type === cipherType_1.CipherType.Login && c.login != null ? c.login.username : null,
            });
            builder.field('login.uris', { boost: 2, extractor: (c) => this.uriExtractor(c) });
            builder.field('fields', { extractor: (c) => this.fieldExtractor(c, false) });
            builder.field('fields_joined', { extractor: (c) => this.fieldExtractor(c, true) });
            builder.field('attachments', { extractor: (c) => this.attachmentExtractor(c, false) });
            builder.field('attachments_joined', { extractor: (c) => this.attachmentExtractor(c, true) });
            builder.field('organizationid', { extractor: (c) => c.organizationId });
            const ciphers = yield this.cipherService.getAllDecrypted();
            ciphers.forEach((c) => builder.add(c));
            this.index = builder.build();
            this.indexing = false;
            // tslint:disable-next-line
            console.timeEnd('search indexing');
        });
    }
    searchCiphers(query, filter = null, ciphers = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            if (query != null) {
                query = query.trim().toLowerCase();
            }
            if (query === '') {
                query = null;
            }
            if (ciphers == null) {
                ciphers = yield this.cipherService.getAllDecrypted();
            }
            if (filter != null) {
                ciphers = ciphers.filter(filter);
            }
            if (!this.isSearchable(query)) {
                return ciphers;
            }
            const index = this.getIndexForSearch();
            if (index == null) {
                // Fall back to basic search if index is not available
                return this.searchCiphersBasic(ciphers, query);
            }
            const ciphersMap = new Map();
            ciphers.forEach((c) => ciphersMap.set(c.id, c));
            let searchResults = null;
            const isQueryString = query != null && query.length > 1 && query.indexOf('>') === 0;
            if (isQueryString) {
                try {
                    searchResults = index.search(query.substr(1).trim());
                }
                catch (_a) { }
            }
            else {
                // tslint:disable-next-line
                const soWild = lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING;
                searchResults = index.query((q) => {
                    lunr.tokenizer(query).forEach((token) => {
                        const t = token.toString();
                        q.term(t, { fields: ['name'], wildcard: soWild });
                        q.term(t, { fields: ['subtitle'], wildcard: soWild });
                        q.term(t, { fields: ['login.uris'], wildcard: soWild });
                        q.term(t, {});
                    });
                });
            }
            if (searchResults != null) {
                searchResults.forEach((r) => {
                    if (ciphersMap.has(r.ref)) {
                        results.push(ciphersMap.get(r.ref));
                    }
                });
            }
            return results;
        });
    }
    searchCiphersBasic(ciphers, query) {
        query = query.trim().toLowerCase();
        return ciphers.filter((c) => {
            if (c.name != null && c.name.toLowerCase().indexOf(query) > -1) {
                return true;
            }
            if (this.onlySearchName) {
                return false;
            }
            if (query.length >= 8 && c.id.startsWith(query)) {
                return true;
            }
            if (c.subTitle != null && c.subTitle.toLowerCase().indexOf(query) > -1) {
                return true;
            }
            if (c.login && c.login.uri != null && c.login.uri.toLowerCase().indexOf(query) > -1) {
                return true;
            }
            return false;
        });
    }
    getIndexForSearch() {
        return this.index;
    }
    fieldExtractor(c, joined) {
        if (!c.hasFields) {
            return null;
        }
        let fields = [];
        c.fields.forEach((f) => {
            if (f.name != null) {
                fields.push(f.name);
            }
            if (f.type === fieldType_1.FieldType.Text && f.value != null) {
                fields.push(f.value);
            }
        });
        fields = fields.filter((f) => f.trim() !== '');
        if (fields.length === 0) {
            return null;
        }
        return joined ? fields.join(' ') : fields;
    }
    attachmentExtractor(c, joined) {
        if (!c.hasAttachments) {
            return null;
        }
        let attachments = [];
        c.attachments.forEach((a) => {
            if (a != null && a.fileName != null) {
                if (joined && a.fileName.indexOf('.') > -1) {
                    attachments.push(a.fileName.substr(0, a.fileName.lastIndexOf('.')));
                }
                else {
                    attachments.push(a.fileName);
                }
            }
        });
        attachments = attachments.filter((f) => f.trim() !== '');
        if (attachments.length === 0) {
            return null;
        }
        return joined ? attachments.join(' ') : attachments;
    }
    uriExtractor(c) {
        if (c.type !== cipherType_1.CipherType.Login || c.login == null || !c.login.hasUris) {
            return null;
        }
        const uris = [];
        c.login.uris.forEach((u) => {
            if (u.uri == null || u.uri === '') {
                return;
            }
            if (u.hostname != null) {
                uris.push(u.hostname);
                return;
            }
            let uri = u.uri;
            if (u.match !== uriMatchType_1.UriMatchType.RegularExpression) {
                const protocolIndex = uri.indexOf('://');
                if (protocolIndex > -1) {
                    uri = uri.substr(protocolIndex + 3);
                }
                const queryIndex = uri.search(/\?|&|#/);
                if (queryIndex > -1) {
                    uri = uri.substring(0, queryIndex);
                }
            }
            uris.push(uri);
        });
        return uris.length > 0 ? uris : null;
    }
}
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map