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
const cipherType_1 = require("../enums/cipherType");
const fieldType_1 = require("../enums/fieldType");
const uriMatchType_1 = require("../enums/uriMatchType");
const cipherData_1 = require("../models/data/cipherData");
const attachment_1 = require("../models/domain/attachment");
const card_1 = require("../models/domain/card");
const cipher_1 = require("../models/domain/cipher");
const field_1 = require("../models/domain/field");
const identity_1 = require("../models/domain/identity");
const login_1 = require("../models/domain/login");
const loginUri_1 = require("../models/domain/loginUri");
const password_1 = require("../models/domain/password");
const secureNote_1 = require("../models/domain/secureNote");
const cipherBulkDeleteRequest_1 = require("../models/request/cipherBulkDeleteRequest");
const cipherBulkMoveRequest_1 = require("../models/request/cipherBulkMoveRequest");
const cipherBulkShareRequest_1 = require("../models/request/cipherBulkShareRequest");
const cipherCollectionsRequest_1 = require("../models/request/cipherCollectionsRequest");
const cipherCreateRequest_1 = require("../models/request/cipherCreateRequest");
const cipherRequest_1 = require("../models/request/cipherRequest");
const cipherShareRequest_1 = require("../models/request/cipherShareRequest");
const passwordHistoryView_1 = require("../models/view/passwordHistoryView");
const constants_service_1 = require("./constants.service");
const sequentialize_1 = require("../misc/sequentialize");
const utils_1 = require("../misc/utils");
const Keys = {
    ciphersPrefix: 'ciphers_',
    localData: 'sitesLocalData',
    neverDomains: 'neverDomains',
};
const DomainMatchBlacklist = new Map([
    ['google.com', new Set(['script.google.com'])],
]);
class CipherService {
    constructor(cryptoService, userService, settingsService, apiService, storageService, i18nService, searchService) {
        this.cryptoService = cryptoService;
        this.userService = userService;
        this.settingsService = settingsService;
        this.apiService = apiService;
        this.storageService = storageService;
        this.i18nService = i18nService;
        this.searchService = searchService;
    }
    get decryptedCipherCache() {
        return this._decryptedCipherCache;
    }
    set decryptedCipherCache(value) {
        this._decryptedCipherCache = value;
        if (this.searchService != null) {
            if (value == null) {
                this.searchService().clearIndex();
            }
            else {
                this.searchService().indexCiphers();
            }
        }
    }
    clearCache() {
        this.decryptedCipherCache = null;
    }
    encrypt(model, key, originalCipher = null) {
        return __awaiter(this, void 0, void 0, function* () {
            // Adjust password history
            if (model.id != null) {
                if (originalCipher == null) {
                    originalCipher = yield this.get(model.id);
                }
                if (originalCipher != null) {
                    const existingCipher = yield originalCipher.decrypt();
                    model.passwordHistory = existingCipher.passwordHistory || [];
                    if (model.type === cipherType_1.CipherType.Login && existingCipher.type === cipherType_1.CipherType.Login) {
                        if (existingCipher.login.password != null && existingCipher.login.password !== '' &&
                            existingCipher.login.password !== model.login.password) {
                            const ph = new passwordHistoryView_1.PasswordHistoryView();
                            ph.password = existingCipher.login.password;
                            ph.lastUsedDate = model.login.passwordRevisionDate = new Date();
                            model.passwordHistory.splice(0, 0, ph);
                        }
                        else {
                            model.login.passwordRevisionDate = existingCipher.login.passwordRevisionDate;
                        }
                    }
                    if (existingCipher.hasFields) {
                        const existingHiddenFields = existingCipher.fields.filter((f) => f.type === fieldType_1.FieldType.Hidden &&
                            f.name != null && f.name !== '' && f.value != null && f.value !== '');
                        const hiddenFields = model.fields == null ? [] :
                            model.fields.filter((f) => f.type === fieldType_1.FieldType.Hidden && f.name != null && f.name !== '');
                        existingHiddenFields.forEach((ef) => {
                            const matchedField = hiddenFields.find((f) => f.name === ef.name);
                            if (matchedField == null || matchedField.value !== ef.value) {
                                const ph = new passwordHistoryView_1.PasswordHistoryView();
                                ph.password = ef.name + ': ' + ef.value;
                                ph.lastUsedDate = new Date();
                                model.passwordHistory.splice(0, 0, ph);
                            }
                        });
                    }
                }
                if (model.passwordHistory != null && model.passwordHistory.length === 0) {
                    model.passwordHistory = null;
                }
                else if (model.passwordHistory != null && model.passwordHistory.length > 5) {
                    // only save last 5 history
                    model.passwordHistory = model.passwordHistory.slice(0, 5);
                }
            }
            const cipher = new cipher_1.Cipher();
            cipher.id = model.id;
            cipher.folderId = model.folderId;
            cipher.favorite = model.favorite;
            cipher.organizationId = model.organizationId;
            cipher.type = model.type;
            cipher.collectionIds = model.collectionIds;
            if (key == null && cipher.organizationId != null) {
                key = yield this.cryptoService.getOrgKey(cipher.organizationId);
                if (key == null) {
                    throw new Error('Cannot encrypt cipher for organization. No key.');
                }
            }
            yield Promise.all([
                this.encryptObjProperty(model, cipher, {
                    name: null,
                    notes: null,
                }, key),
                this.encryptCipherData(cipher, model, key),
                this.encryptFields(model.fields, key).then((fields) => {
                    cipher.fields = fields;
                }),
                this.encryptPasswordHistories(model.passwordHistory, key).then((ph) => {
                    cipher.passwordHistory = ph;
                }),
                this.encryptAttachments(model.attachments, key).then((attachments) => {
                    cipher.attachments = attachments;
                }),
            ]);
            return cipher;
        });
    }
    encryptAttachments(attachmentsModel, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (attachmentsModel == null || attachmentsModel.length === 0) {
                return null;
            }
            const promises = [];
            const encAttachments = [];
            attachmentsModel.forEach((model) => __awaiter(this, void 0, void 0, function* () {
                const attachment = new attachment_1.Attachment();
                attachment.id = model.id;
                attachment.size = model.size;
                attachment.sizeName = model.sizeName;
                attachment.url = model.url;
                const promise = this.encryptObjProperty(model, attachment, {
                    fileName: null,
                }, key).then(() => __awaiter(this, void 0, void 0, function* () {
                    if (model.key != null) {
                        attachment.key = yield this.cryptoService.encrypt(model.key.key, key);
                    }
                    encAttachments.push(attachment);
                }));
                promises.push(promise);
            }));
            yield Promise.all(promises);
            return encAttachments;
        });
    }
    encryptFields(fieldsModel, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fieldsModel || !fieldsModel.length) {
                return null;
            }
            const self = this;
            const encFields = [];
            yield fieldsModel.reduce((promise, field) => {
                return promise.then(() => {
                    return self.encryptField(field, key);
                }).then((encField) => {
                    encFields.push(encField);
                });
            }, Promise.resolve());
            return encFields;
        });
    }
    encryptField(fieldModel, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const field = new field_1.Field();
            field.type = fieldModel.type;
            // normalize boolean type field values
            if (fieldModel.type === fieldType_1.FieldType.Boolean && fieldModel.value !== 'true') {
                fieldModel.value = 'false';
            }
            yield this.encryptObjProperty(fieldModel, field, {
                name: null,
                value: null,
            }, key);
            return field;
        });
    }
    encryptPasswordHistories(phModels, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!phModels || !phModels.length) {
                return null;
            }
            const self = this;
            const encPhs = [];
            yield phModels.reduce((promise, ph) => {
                return promise.then(() => {
                    return self.encryptPasswordHistory(ph, key);
                }).then((encPh) => {
                    encPhs.push(encPh);
                });
            }, Promise.resolve());
            return encPhs;
        });
    }
    encryptPasswordHistory(phModel, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const ph = new password_1.Password();
            ph.lastUsedDate = phModel.lastUsedDate;
            yield this.encryptObjProperty(phModel, ph, {
                password: null,
            }, key);
            return ph;
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const localData = yield this.storageService.get(Keys.localData);
            const ciphers = yield this.storageService.get(Keys.ciphersPrefix + userId);
            if (ciphers == null || !ciphers.hasOwnProperty(id)) {
                return null;
            }
            return new cipher_1.Cipher(ciphers[id], false, localData ? localData[id] : null);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const localData = yield this.storageService.get(Keys.localData);
            const ciphers = yield this.storageService.get(Keys.ciphersPrefix + userId);
            const response = [];
            for (const id in ciphers) {
                if (ciphers.hasOwnProperty(id)) {
                    response.push(new cipher_1.Cipher(ciphers[id], false, localData ? localData[id] : null));
                }
            }
            return response;
        });
    }
    getAllDecrypted() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.decryptedCipherCache != null) {
                return this.decryptedCipherCache;
            }
            const decCiphers = [];
            const hasKey = yield this.cryptoService.hasKey();
            if (!hasKey) {
                throw new Error('No key.');
            }
            const promises = [];
            const ciphers = yield this.getAll();
            ciphers.forEach((cipher) => {
                promises.push(cipher.decrypt().then((c) => decCiphers.push(c)));
            });
            yield Promise.all(promises);
            decCiphers.sort(this.getLocaleSortingFunction());
            this.decryptedCipherCache = decCiphers;
            return this.decryptedCipherCache;
        });
    }
    getAllDecryptedForGrouping(groupingId, folder = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const ciphers = yield this.getAllDecrypted();
            return ciphers.filter((cipher) => {
                if (folder && cipher.folderId === groupingId) {
                    return true;
                }
                else if (!folder && cipher.collectionIds != null && cipher.collectionIds.indexOf(groupingId) > -1) {
                    return true;
                }
                return false;
            });
        });
    }
    getAllDecryptedForUrl(url, includeOtherTypes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (url == null && includeOtherTypes == null) {
                return Promise.resolve([]);
            }
            const domain = utils_1.Utils.getDomain(url);
            const eqDomainsPromise = domain == null ? Promise.resolve([]) :
                this.settingsService.getEquivalentDomains().then((eqDomains) => {
                    let matches = [];
                    eqDomains.forEach((eqDomain) => {
                        if (eqDomain.length && eqDomain.indexOf(domain) >= 0) {
                            matches = matches.concat(eqDomain);
                        }
                    });
                    if (!matches.length) {
                        matches.push(domain);
                    }
                    return matches;
                });
            const result = yield Promise.all([eqDomainsPromise, this.getAllDecrypted()]);
            const matchingDomains = result[0];
            const ciphers = result[1];
            let defaultMatch = yield this.storageService.get(constants_service_1.ConstantsService.defaultUriMatch);
            if (defaultMatch == null) {
                defaultMatch = uriMatchType_1.UriMatchType.Domain;
            }
            return ciphers.filter((cipher) => {
                if (includeOtherTypes != null && includeOtherTypes.indexOf(cipher.type) > -1) {
                    return true;
                }
                if (url != null && cipher.type === cipherType_1.CipherType.Login && cipher.login.uris != null) {
                    for (let i = 0; i < cipher.login.uris.length; i++) {
                        const u = cipher.login.uris[i];
                        if (u.uri == null) {
                            continue;
                        }
                        const match = u.match == null ? defaultMatch : u.match;
                        switch (match) {
                            case uriMatchType_1.UriMatchType.Domain:
                                if (domain != null && u.domain != null && matchingDomains.indexOf(u.domain) > -1) {
                                    if (DomainMatchBlacklist.has(u.domain)) {
                                        const domainUrlHost = utils_1.Utils.getHost(url);
                                        if (!DomainMatchBlacklist.get(u.domain).has(domainUrlHost)) {
                                            return true;
                                        }
                                    }
                                    else {
                                        return true;
                                    }
                                }
                                break;
                            case uriMatchType_1.UriMatchType.Host:
                                const urlHost = utils_1.Utils.getHost(url);
                                if (urlHost != null && urlHost === utils_1.Utils.getHost(u.uri)) {
                                    return true;
                                }
                                break;
                            case uriMatchType_1.UriMatchType.Exact:
                                if (url === u.uri) {
                                    return true;
                                }
                                break;
                            case uriMatchType_1.UriMatchType.StartsWith:
                                if (url.startsWith(u.uri)) {
                                    return true;
                                }
                                break;
                            case uriMatchType_1.UriMatchType.RegularExpression:
                                try {
                                    const regex = new RegExp(u.uri, 'i');
                                    if (regex.test(url)) {
                                        return true;
                                    }
                                }
                                catch (_a) { }
                                break;
                            case uriMatchType_1.UriMatchType.Never:
                            default:
                                break;
                        }
                    }
                }
                return false;
            });
        });
    }
    getAllFromApiForOrganization(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ciphers = yield this.apiService.getCiphersOrganization(organizationId);
            if (ciphers != null && ciphers.data != null && ciphers.data.length) {
                const decCiphers = [];
                const promises = [];
                ciphers.data.forEach((r) => {
                    const data = new cipherData_1.CipherData(r);
                    const cipher = new cipher_1.Cipher(data);
                    promises.push(cipher.decrypt().then((c) => decCiphers.push(c)));
                });
                yield Promise.all(promises);
                decCiphers.sort(this.getLocaleSortingFunction());
                return decCiphers;
            }
            else {
                return [];
            }
        });
    }
    getLastUsedForUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const ciphers = yield this.getAllDecryptedForUrl(url);
            if (ciphers.length === 0) {
                return null;
            }
            const sortedCiphers = ciphers.sort(this.sortCiphersByLastUsed);
            return sortedCiphers[0];
        });
    }
    updateLastUsedDate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let ciphersLocalData = yield this.storageService.get(Keys.localData);
            if (!ciphersLocalData) {
                ciphersLocalData = {};
            }
            if (ciphersLocalData[id]) {
                ciphersLocalData[id].lastUsedDate = new Date().getTime();
            }
            else {
                ciphersLocalData[id] = {
                    lastUsedDate: new Date().getTime(),
                };
            }
            yield this.storageService.save(Keys.localData, ciphersLocalData);
            if (this.decryptedCipherCache == null) {
                return;
            }
            for (let i = 0; i < this.decryptedCipherCache.length; i++) {
                const cached = this.decryptedCipherCache[i];
                if (cached.id === id) {
                    cached.localData = ciphersLocalData[id];
                    break;
                }
            }
        });
    }
    saveNeverDomain(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            if (domain == null) {
                return;
            }
            let domains = yield this.storageService.get(Keys.neverDomains);
            if (!domains) {
                domains = {};
            }
            domains[domain] = null;
            yield this.storageService.save(Keys.neverDomains, domains);
        });
    }
    saveWithServer(cipher) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            if (cipher.id == null) {
                if (cipher.collectionIds != null) {
                    const request = new cipherCreateRequest_1.CipherCreateRequest(cipher);
                    response = yield this.apiService.postCipherCreate(request);
                }
                else {
                    const request = new cipherRequest_1.CipherRequest(cipher);
                    response = yield this.apiService.postCipher(request);
                }
                cipher.id = response.id;
            }
            else {
                const request = new cipherRequest_1.CipherRequest(cipher);
                response = yield this.apiService.putCipher(cipher.id, request);
            }
            const userId = yield this.userService.getUserId();
            const data = new cipherData_1.CipherData(response, userId, cipher.collectionIds);
            yield this.upsert(data);
        });
    }
    shareWithServer(cipher, organizationId, collectionIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachmentPromises = [];
            if (cipher.attachments != null) {
                cipher.attachments.forEach((attachment) => {
                    if (attachment.key == null) {
                        attachmentPromises.push(this.shareAttachmentWithServer(attachment, cipher.id, organizationId));
                    }
                });
            }
            yield Promise.all(attachmentPromises);
            cipher.organizationId = organizationId;
            cipher.collectionIds = collectionIds;
            const encCipher = yield this.encrypt(cipher);
            const request = new cipherShareRequest_1.CipherShareRequest(encCipher);
            const response = yield this.apiService.putShareCipher(cipher.id, request);
            const userId = yield this.userService.getUserId();
            const data = new cipherData_1.CipherData(response, userId, collectionIds);
            yield this.upsert(data);
        });
    }
    shareManyWithServer(ciphers, organizationId, collectionIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            const encCiphers = [];
            for (const cipher of ciphers) {
                cipher.organizationId = organizationId;
                cipher.collectionIds = collectionIds;
                promises.push(this.encrypt(cipher).then((c) => {
                    encCiphers.push(c);
                }));
            }
            yield Promise.all(promises);
            const request = new cipherBulkShareRequest_1.CipherBulkShareRequest(encCiphers, collectionIds);
            yield this.apiService.putShareCiphers(request);
            const userId = yield this.userService.getUserId();
            yield this.upsert(encCiphers.map((c) => c.toCipherData(userId)));
        });
    }
    saveAttachmentWithServer(cipher, unencryptedFile, admin = false) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(unencryptedFile);
            reader.onload = (evt) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const cData = yield this.saveAttachmentRawWithServer(cipher, unencryptedFile.name, evt.target.result, admin);
                    resolve(cData);
                }
                catch (e) {
                    reject(e);
                }
            });
            reader.onerror = (evt) => {
                reject('Error reading file.');
            };
        });
    }
    saveAttachmentRawWithServer(cipher, filename, data, admin = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.cryptoService.getOrgKey(cipher.organizationId);
            const encFileName = yield this.cryptoService.encrypt(filename, key);
            const dataEncKey = yield this.cryptoService.makeEncKey(key);
            const encData = yield this.cryptoService.encryptToBytes(data, dataEncKey[0]);
            const fd = new FormData();
            try {
                const blob = new Blob([encData], { type: 'application/octet-stream' });
                fd.append('key', dataEncKey[1].encryptedString);
                fd.append('data', blob, encFileName.encryptedString);
            }
            catch (e) {
                if (utils_1.Utils.isNode && !utils_1.Utils.isBrowser) {
                    fd.append('key', dataEncKey[1].encryptedString);
                    fd.append('data', Buffer.from(encData), {
                        filepath: encFileName.encryptedString,
                        contentType: 'application/octet-stream',
                    });
                }
                else {
                    throw e;
                }
            }
            let response;
            try {
                if (admin) {
                    response = yield this.apiService.postCipherAttachmentAdmin(cipher.id, fd);
                }
                else {
                    response = yield this.apiService.postCipherAttachment(cipher.id, fd);
                }
            }
            catch (e) {
                throw new Error(e.getSingleMessage());
            }
            const userId = yield this.userService.getUserId();
            const cData = new cipherData_1.CipherData(response, userId, cipher.collectionIds);
            if (!admin) {
                yield this.upsert(cData);
            }
            return new cipher_1.Cipher(cData);
        });
    }
    saveCollectionsWithServer(cipher) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new cipherCollectionsRequest_1.CipherCollectionsRequest(cipher.collectionIds);
            yield this.apiService.putCipherCollections(cipher.id, request);
            const userId = yield this.userService.getUserId();
            const data = cipher.toCipherData(userId);
            yield this.upsert(data);
        });
    }
    upsert(cipher) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            let ciphers = yield this.storageService.get(Keys.ciphersPrefix + userId);
            if (ciphers == null) {
                ciphers = {};
            }
            if (cipher instanceof cipherData_1.CipherData) {
                const c = cipher;
                ciphers[c.id] = c;
            }
            else {
                cipher.forEach((c) => {
                    ciphers[c.id] = c;
                });
            }
            yield this.storageService.save(Keys.ciphersPrefix + userId, ciphers);
            this.decryptedCipherCache = null;
        });
    }
    replace(ciphers) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            yield this.storageService.save(Keys.ciphersPrefix + userId, ciphers);
            this.decryptedCipherCache = null;
        });
    }
    clear(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storageService.remove(Keys.ciphersPrefix + userId);
            this.clearCache();
        });
    }
    moveManyWithServer(ids, folderId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.putMoveCiphers(new cipherBulkMoveRequest_1.CipherBulkMoveRequest(ids, folderId));
            const userId = yield this.userService.getUserId();
            let ciphers = yield this.storageService.get(Keys.ciphersPrefix + userId);
            if (ciphers == null) {
                ciphers = {};
            }
            ids.forEach((id) => {
                if (ciphers.hasOwnProperty(id)) {
                    ciphers[id].folderId = folderId;
                }
            });
            yield this.storageService.save(Keys.ciphersPrefix + userId, ciphers);
            this.decryptedCipherCache = null;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const ciphers = yield this.storageService.get(Keys.ciphersPrefix + userId);
            if (ciphers == null) {
                return;
            }
            if (typeof id === 'string') {
                if (ciphers[id] == null) {
                    return;
                }
                delete ciphers[id];
            }
            else {
                id.forEach((i) => {
                    delete ciphers[i];
                });
            }
            yield this.storageService.save(Keys.ciphersPrefix + userId, ciphers);
            this.decryptedCipherCache = null;
        });
    }
    deleteWithServer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.deleteCipher(id);
            yield this.delete(id);
        });
    }
    deleteManyWithServer(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.deleteManyCiphers(new cipherBulkDeleteRequest_1.CipherBulkDeleteRequest(ids));
            yield this.delete(ids);
        });
    }
    deleteAttachment(id, attachmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const ciphers = yield this.storageService.get(Keys.ciphersPrefix + userId);
            if (ciphers == null || !ciphers.hasOwnProperty(id) || ciphers[id].attachments == null) {
                return;
            }
            for (let i = 0; i < ciphers[id].attachments.length; i++) {
                if (ciphers[id].attachments[i].id === attachmentId) {
                    ciphers[id].attachments.splice(i, 1);
                }
            }
            yield this.storageService.save(Keys.ciphersPrefix + userId, ciphers);
            this.decryptedCipherCache = null;
        });
    }
    deleteAttachmentWithServer(id, attachmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.apiService.deleteCipherAttachment(id, attachmentId);
            }
            catch (e) {
                return Promise.reject(e.getSingleMessage());
            }
            yield this.deleteAttachment(id, attachmentId);
        });
    }
    sortCiphersByLastUsed(a, b) {
        const aLastUsed = a.localData && a.localData.lastUsedDate ? a.localData.lastUsedDate : null;
        const bLastUsed = b.localData && b.localData.lastUsedDate ? b.localData.lastUsedDate : null;
        const bothNotNull = aLastUsed != null && bLastUsed != null;
        if (bothNotNull && aLastUsed < bLastUsed) {
            return 1;
        }
        if (aLastUsed != null && bLastUsed == null) {
            return -1;
        }
        if (bothNotNull && aLastUsed > bLastUsed) {
            return -1;
        }
        if (bLastUsed != null && aLastUsed == null) {
            return 1;
        }
        return 0;
    }
    sortCiphersByLastUsedThenName(a, b) {
        const result = this.sortCiphersByLastUsed(a, b);
        if (result !== 0) {
            return result;
        }
        return this.getLocaleSortingFunction()(a, b);
    }
    getLocaleSortingFunction() {
        return (a, b) => {
            let aName = a.name;
            let bName = b.name;
            if (aName == null && bName != null) {
                return -1;
            }
            if (aName != null && bName == null) {
                return 1;
            }
            if (aName == null && bName == null) {
                return 0;
            }
            const result = this.i18nService.collator ? this.i18nService.collator.compare(aName, bName) :
                aName.localeCompare(bName);
            if (result !== 0 || a.type !== cipherType_1.CipherType.Login || b.type !== cipherType_1.CipherType.Login) {
                return result;
            }
            if (a.login.username != null) {
                aName += a.login.username;
            }
            if (b.login.username != null) {
                bName += b.login.username;
            }
            return this.i18nService.collator ? this.i18nService.collator.compare(aName, bName) :
                aName.localeCompare(bName);
        };
    }
    // Helpers
    shareAttachmentWithServer(attachmentView, cipherId, organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachmentResponse = yield fetch(new Request(attachmentView.url, { cache: 'no-cache' }));
            if (attachmentResponse.status !== 200) {
                throw Error('Failed to download attachment: ' + attachmentResponse.status.toString());
            }
            const buf = yield attachmentResponse.arrayBuffer();
            const decBuf = yield this.cryptoService.decryptFromBytes(buf, null);
            const key = yield this.cryptoService.getOrgKey(organizationId);
            const encFileName = yield this.cryptoService.encrypt(attachmentView.fileName, key);
            const dataEncKey = yield this.cryptoService.makeEncKey(key);
            const encData = yield this.cryptoService.encryptToBytes(decBuf, dataEncKey[0]);
            const fd = new FormData();
            try {
                const blob = new Blob([encData], { type: 'application/octet-stream' });
                fd.append('key', dataEncKey[1].encryptedString);
                fd.append('data', blob, encFileName.encryptedString);
            }
            catch (e) {
                if (utils_1.Utils.isNode && !utils_1.Utils.isBrowser) {
                    fd.append('key', dataEncKey[1].encryptedString);
                    fd.append('data', Buffer.from(encData), {
                        filepath: encFileName.encryptedString,
                        contentType: 'application/octet-stream',
                    });
                }
                else {
                    throw e;
                }
            }
            try {
                yield this.apiService.postShareCipherAttachment(cipherId, attachmentView.id, fd, organizationId);
            }
            catch (e) {
                throw new Error(e.getSingleMessage());
            }
        });
    }
    encryptObjProperty(model, obj, map, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            const self = this;
            for (const prop in map) {
                if (!map.hasOwnProperty(prop)) {
                    continue;
                }
                // tslint:disable-next-line
                (function (theProp, theObj) {
                    const p = Promise.resolve().then(() => {
                        const modelProp = model[(map[theProp] || theProp)];
                        if (modelProp && modelProp !== '') {
                            return self.cryptoService.encrypt(modelProp, key);
                        }
                        return null;
                    }).then((val) => {
                        theObj[theProp] = val;
                    });
                    promises.push(p);
                })(prop, obj);
            }
            yield Promise.all(promises);
        });
    }
    encryptCipherData(cipher, model, key) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (cipher.type) {
                case cipherType_1.CipherType.Login:
                    cipher.login = new login_1.Login();
                    cipher.login.passwordRevisionDate = model.login.passwordRevisionDate;
                    yield this.encryptObjProperty(model.login, cipher.login, {
                        username: null,
                        password: null,
                        totp: null,
                    }, key);
                    if (model.login.uris != null) {
                        cipher.login.uris = [];
                        for (let i = 0; i < model.login.uris.length; i++) {
                            const loginUri = new loginUri_1.LoginUri();
                            loginUri.match = model.login.uris[i].match;
                            yield this.encryptObjProperty(model.login.uris[i], loginUri, {
                                uri: null,
                            }, key);
                            cipher.login.uris.push(loginUri);
                        }
                    }
                    return;
                case cipherType_1.CipherType.SecureNote:
                    cipher.secureNote = new secureNote_1.SecureNote();
                    cipher.secureNote.type = model.secureNote.type;
                    return;
                case cipherType_1.CipherType.Card:
                    cipher.card = new card_1.Card();
                    yield this.encryptObjProperty(model.card, cipher.card, {
                        cardholderName: null,
                        brand: null,
                        number: null,
                        expMonth: null,
                        expYear: null,
                        code: null,
                    }, key);
                    return;
                case cipherType_1.CipherType.Identity:
                    cipher.identity = new identity_1.Identity();
                    yield this.encryptObjProperty(model.identity, cipher.identity, {
                        title: null,
                        firstName: null,
                        middleName: null,
                        lastName: null,
                        address1: null,
                        address2: null,
                        address3: null,
                        city: null,
                        state: null,
                        postalCode: null,
                        country: null,
                        company: null,
                        email: null,
                        phone: null,
                        ssn: null,
                        username: null,
                        passportNumber: null,
                        licenseNumber: null,
                    }, key);
                    return;
                default:
                    throw new Error('Unknown cipher type.');
            }
        });
    }
}
__decorate([
    sequentialize_1.sequentialize(() => 'getAllDecrypted'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CipherService.prototype, "getAllDecrypted", null);
exports.CipherService = CipherService;
//# sourceMappingURL=cipher.service.js.map