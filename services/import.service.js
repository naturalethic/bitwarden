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
const cipherType_1 = require("../enums/cipherType");
const utils_1 = require("../misc/utils");
const cipherRequest_1 = require("../models/request/cipherRequest");
const collectionRequest_1 = require("../models/request/collectionRequest");
const folderRequest_1 = require("../models/request/folderRequest");
const importCiphersRequest_1 = require("../models/request/importCiphersRequest");
const importOrganizationCiphersRequest_1 = require("../models/request/importOrganizationCiphersRequest");
const kvpRequest_1 = require("../models/request/kvpRequest");
const ascendoCsvImporter_1 = require("../importers/ascendoCsvImporter");
const avastCsvImporter_1 = require("../importers/avastCsvImporter");
const aviraCsvImporter_1 = require("../importers/aviraCsvImporter");
const bitwardenCsvImporter_1 = require("../importers/bitwardenCsvImporter");
const bitwardenJsonImporter_1 = require("../importers/bitwardenJsonImporter");
const blurCsvImporter_1 = require("../importers/blurCsvImporter");
const chromeCsvImporter_1 = require("../importers/chromeCsvImporter");
const clipperzHtmlImporter_1 = require("../importers/clipperzHtmlImporter");
const dashlaneJsonImporter_1 = require("../importers/dashlaneJsonImporter");
const enpassCsvImporter_1 = require("../importers/enpassCsvImporter");
const enpassJsonImporter_1 = require("../importers/enpassJsonImporter");
const firefoxCsvImporter_1 = require("../importers/firefoxCsvImporter");
const fsecureFskImporter_1 = require("../importers/fsecureFskImporter");
const gnomeJsonImporter_1 = require("../importers/gnomeJsonImporter");
const kasperskyTxtImporter_1 = require("../importers/kasperskyTxtImporter");
const keepass2XmlImporter_1 = require("../importers/keepass2XmlImporter");
const keepassxCsvImporter_1 = require("../importers/keepassxCsvImporter");
const keeperCsvImporter_1 = require("../importers/keeperCsvImporter");
const lastpassCsvImporter_1 = require("../importers/lastpassCsvImporter");
const meldiumCsvImporter_1 = require("../importers/meldiumCsvImporter");
const msecureCsvImporter_1 = require("../importers/msecureCsvImporter");
const onepassword1PifImporter_1 = require("../importers/onepassword1PifImporter");
const onepasswordWinCsvImporter_1 = require("../importers/onepasswordWinCsvImporter");
const padlockCsvImporter_1 = require("../importers/padlockCsvImporter");
const passkeepCsvImporter_1 = require("../importers/passkeepCsvImporter");
const passmanJsonImporter_1 = require("../importers/passmanJsonImporter");
const passpackCsvImporter_1 = require("../importers/passpackCsvImporter");
const passwordAgentCsvImporter_1 = require("../importers/passwordAgentCsvImporter");
const passwordBossJsonImporter_1 = require("../importers/passwordBossJsonImporter");
const passwordDragonXmlImporter_1 = require("../importers/passwordDragonXmlImporter");
const passwordSafeXmlImporter_1 = require("../importers/passwordSafeXmlImporter");
const passwordWalletTxtImporter_1 = require("../importers/passwordWalletTxtImporter");
const rememBearCsvImporter_1 = require("../importers/rememBearCsvImporter");
const roboformCsvImporter_1 = require("../importers/roboformCsvImporter");
const safeInCloudXmlImporter_1 = require("../importers/safeInCloudXmlImporter");
const saferpassCsvImport_1 = require("../importers/saferpassCsvImport");
const splashIdCsvImporter_1 = require("../importers/splashIdCsvImporter");
const stickyPasswordXmlImporter_1 = require("../importers/stickyPasswordXmlImporter");
const truekeyCsvImporter_1 = require("../importers/truekeyCsvImporter");
const upmCsvImporter_1 = require("../importers/upmCsvImporter");
const zohoVaultCsvImporter_1 = require("../importers/zohoVaultCsvImporter");
class ImportService {
    constructor(cipherService, folderService, apiService, i18nService, collectionService) {
        this.cipherService = cipherService;
        this.folderService = folderService;
        this.apiService = apiService;
        this.i18nService = i18nService;
        this.collectionService = collectionService;
        this.featuredImportOptions = [
            { id: 'bitwardenjson', name: 'Bitwarden (json)' },
            { id: 'bitwardencsv', name: 'Bitwarden (csv)' },
            { id: 'lastpasscsv', name: 'LastPass (csv)' },
            { id: 'chromecsv', name: 'Chrome (csv)' },
            { id: 'firefoxcsv', name: 'Firefox (csv)' },
            { id: 'keepass2xml', name: 'KeePass 2 (xml)' },
            { id: '1password1pif', name: '1Password (1pif)' },
            { id: 'dashlanejson', name: 'Dashlane (json)' },
        ];
        this.regularImportOptions = [
            { id: 'keepassxcsv', name: 'KeePassX (csv)' },
            { id: '1passwordwincsv', name: '1Password 6 and 7 Windows (csv)' },
            { id: 'roboformcsv', name: 'RoboForm (csv)' },
            { id: 'keepercsv', name: 'Keeper (csv)' },
            { id: 'enpasscsv', name: 'Enpass (csv)' },
            { id: 'enpassjson', name: 'Enpass (json)' },
            { id: 'safeincloudxml', name: 'SafeInCloud (xml)' },
            { id: 'pwsafexml', name: 'Password Safe (xml)' },
            { id: 'stickypasswordxml', name: 'Sticky Password (xml)' },
            { id: 'msecurecsv', name: 'mSecure (csv)' },
            { id: 'truekeycsv', name: 'True Key (csv)' },
            { id: 'passwordbossjson', name: 'Password Boss (json)' },
            { id: 'zohovaultcsv', name: 'Zoho Vault (csv)' },
            { id: 'splashidcsv', name: 'SplashID (csv)' },
            { id: 'passworddragonxml', name: 'Password Dragon (xml)' },
            { id: 'padlockcsv', name: 'Padlock (csv)' },
            { id: 'passboltcsv', name: 'Passbolt (csv)' },
            { id: 'clipperzhtml', name: 'Clipperz (html)' },
            { id: 'aviracsv', name: 'Avira (csv)' },
            { id: 'saferpasscsv', name: 'SaferPass (csv)' },
            { id: 'upmcsv', name: 'Universal Password Manager (csv)' },
            { id: 'ascendocsv', name: 'Ascendo DataVault (csv)' },
            { id: 'meldiumcsv', name: 'Meldium (csv)' },
            { id: 'passkeepcsv', name: 'PassKeep (csv)' },
            { id: 'operacsv', name: 'Opera (csv)' },
            { id: 'vivaldicsv', name: 'Vivaldi (csv)' },
            { id: 'gnomejson', name: 'GNOME Passwords and Keys/Seahorse (json)' },
            { id: 'blurcsv', name: 'Blur (csv)' },
            { id: 'passwordagentcsv', name: 'Password Agent (csv)' },
            { id: 'passpackcsv', name: 'Passpack (csv)' },
            { id: 'passmanjson', name: 'Passman (json)' },
            { id: 'avastcsv', name: 'Avast Passwords (csv)' },
            { id: 'fsecurefsk', name: 'F-Secure KEY (fsk)' },
            { id: 'kasperskytxt', name: 'Kaspersky Password Manager (txt)' },
            { id: 'remembearcsv', name: 'RememBear (csv)' },
            { id: 'passwordwallettxt', name: 'PasswordWallet (txt)' },
        ];
    }
    getImportOptions() {
        return this.featuredImportOptions.concat(this.regularImportOptions);
    }
    import(importer, fileContents, organizationId = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const importResult = yield importer.parse(fileContents);
            if (importResult.success) {
                if (importResult.folders.length === 0 && importResult.ciphers.length === 0) {
                    return new Error(this.i18nService.t('importNothingError'));
                }
                else if (importResult.ciphers.length > 0) {
                    const halfway = Math.floor(importResult.ciphers.length / 2);
                    const last = importResult.ciphers.length - 1;
                    if (this.badData(importResult.ciphers[0]) &&
                        this.badData(importResult.ciphers[halfway]) &&
                        this.badData(importResult.ciphers[last])) {
                        return new Error(this.i18nService.t('importFormatError'));
                    }
                }
                yield this.postImport(importResult, organizationId);
                return null;
            }
            else {
                return new Error(this.i18nService.t('importFormatError'));
            }
        });
    }
    getImporter(format, organization = false) {
        const importer = this.getImporterInstance(format);
        if (importer == null) {
            return null;
        }
        importer.organization = organization;
        return importer;
    }
    getImporterInstance(format) {
        if (format == null || format === '') {
            return null;
        }
        switch (format) {
            case 'bitwardencsv':
                return new bitwardenCsvImporter_1.BitwardenCsvImporter();
            case 'bitwardenjson':
                return new bitwardenJsonImporter_1.BitwardenJsonImporter();
            case 'lastpasscsv':
            case 'passboltcsv':
                return new lastpassCsvImporter_1.LastPassCsvImporter();
            case 'keepassxcsv':
                return new keepassxCsvImporter_1.KeePassXCsvImporter();
            case 'aviracsv':
                return new aviraCsvImporter_1.AviraCsvImporter();
            case 'blurcsv':
                return new blurCsvImporter_1.BlurCsvImporter();
            case 'safeincloudxml':
                return new safeInCloudXmlImporter_1.SafeInCloudXmlImporter();
            case 'padlockcsv':
                return new padlockCsvImporter_1.PadlockCsvImporter();
            case 'keepass2xml':
                return new keepass2XmlImporter_1.KeePass2XmlImporter();
            case 'chromecsv':
            case 'operacsv':
            case 'vivaldicsv':
                return new chromeCsvImporter_1.ChromeCsvImporter();
            case 'firefoxcsv':
                return new firefoxCsvImporter_1.FirefoxCsvImporter();
            case 'upmcsv':
                return new upmCsvImporter_1.UpmCsvImporter();
            case 'saferpasscsv':
                return new saferpassCsvImport_1.SaferPassCsvImporter();
            case 'meldiumcsv':
                return new meldiumCsvImporter_1.MeldiumCsvImporter();
            case '1password1pif':
                return new onepassword1PifImporter_1.OnePassword1PifImporter();
            case '1passwordwincsv':
                return new onepasswordWinCsvImporter_1.OnePasswordWinCsvImporter();
            case 'keepercsv':
                return new keeperCsvImporter_1.KeeperCsvImporter();
            case 'passworddragonxml':
                return new passwordDragonXmlImporter_1.PasswordDragonXmlImporter();
            case 'enpasscsv':
                return new enpassCsvImporter_1.EnpassCsvImporter();
            case 'enpassjson':
                return new enpassJsonImporter_1.EnpassJsonImporter();
            case 'pwsafexml':
                return new passwordSafeXmlImporter_1.PasswordSafeXmlImporter();
            case 'dashlanejson':
                return new dashlaneJsonImporter_1.DashlaneJsonImporter();
            case 'msecurecsv':
                return new msecureCsvImporter_1.MSecureCsvImporter();
            case 'stickypasswordxml':
                return new stickyPasswordXmlImporter_1.StickyPasswordXmlImporter();
            case 'truekeycsv':
                return new truekeyCsvImporter_1.TrueKeyCsvImporter();
            case 'clipperzhtml':
                return new clipperzHtmlImporter_1.ClipperzHtmlImporter();
            case 'roboformcsv':
                return new roboformCsvImporter_1.RoboFormCsvImporter();
            case 'ascendocsv':
                return new ascendoCsvImporter_1.AscendoCsvImporter();
            case 'passwordbossjson':
                return new passwordBossJsonImporter_1.PasswordBossJsonImporter();
            case 'zohovaultcsv':
                return new zohoVaultCsvImporter_1.ZohoVaultCsvImporter();
            case 'splashidcsv':
                return new splashIdCsvImporter_1.SplashIdCsvImporter();
            case 'passkeepcsv':
                return new passkeepCsvImporter_1.PassKeepCsvImporter();
            case 'gnomejson':
                return new gnomeJsonImporter_1.GnomeJsonImporter();
            case 'passwordagentcsv':
                return new passwordAgentCsvImporter_1.PasswordAgentCsvImporter();
            case 'passpackcsv':
                return new passpackCsvImporter_1.PasspackCsvImporter();
            case 'passmanjson':
                return new passmanJsonImporter_1.PassmanJsonImporter();
            case 'avastcsv':
                return new avastCsvImporter_1.AvastCsvImporter();
            case 'fsecurefsk':
                return new fsecureFskImporter_1.FSecureFskImporter();
            case 'kasperskytxt':
                return new kasperskyTxtImporter_1.KasperskyTxtImporter();
            case 'remembearcsv':
                return new rememBearCsvImporter_1.RememBearCsvImporter();
            case 'passwordwallettxt':
                return new passwordWalletTxtImporter_1.PasswordWalletTxtImporter();
            default:
                return null;
        }
    }
    postImport(importResult, organizationId = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (organizationId == null) {
                const request = new importCiphersRequest_1.ImportCiphersRequest();
                for (let i = 0; i < importResult.ciphers.length; i++) {
                    const c = yield this.cipherService.encrypt(importResult.ciphers[i]);
                    request.ciphers.push(new cipherRequest_1.CipherRequest(c));
                }
                if (importResult.folders != null) {
                    for (let i = 0; i < importResult.folders.length; i++) {
                        const f = yield this.folderService.encrypt(importResult.folders[i]);
                        request.folders.push(new folderRequest_1.FolderRequest(f));
                    }
                }
                if (importResult.folderRelationships != null) {
                    importResult.folderRelationships.forEach((r) => request.folderRelationships.push(new kvpRequest_1.KvpRequest(r[0], r[1])));
                }
                return yield this.apiService.postImportCiphers(request);
            }
            else {
                const request = new importOrganizationCiphersRequest_1.ImportOrganizationCiphersRequest();
                for (let i = 0; i < importResult.ciphers.length; i++) {
                    importResult.ciphers[i].organizationId = organizationId;
                    const c = yield this.cipherService.encrypt(importResult.ciphers[i]);
                    request.ciphers.push(new cipherRequest_1.CipherRequest(c));
                }
                if (importResult.collections != null) {
                    for (let i = 0; i < importResult.collections.length; i++) {
                        importResult.collections[i].organizationId = organizationId;
                        const c = yield this.collectionService.encrypt(importResult.collections[i]);
                        request.collections.push(new collectionRequest_1.CollectionRequest(c));
                    }
                }
                if (importResult.collectionRelationships != null) {
                    importResult.collectionRelationships.forEach((r) => request.collectionRelationships.push(new kvpRequest_1.KvpRequest(r[0], r[1])));
                }
                return yield this.apiService.postImportOrganizationCiphers(organizationId, request);
            }
        });
    }
    badData(c) {
        return (c.name == null || c.name === '--') &&
            (c.type === cipherType_1.CipherType.Login && c.login != null && utils_1.Utils.isNullOrWhitespace(c.login.password));
    }
}
exports.ImportService = ImportService;
//# sourceMappingURL=import.service.js.map