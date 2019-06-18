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
class I18nService {
    constructor(systemLanguage, localesDirectory, getLocalesJson) {
        this.systemLanguage = systemLanguage;
        this.localesDirectory = localesDirectory;
        this.getLocalesJson = getLocalesJson;
        // First locale is the default (English)
        this.supportedTranslationLocales = ['en'];
        this.defaultMessages = {};
        this.localeMessages = {};
        this.systemLanguage = systemLanguage.replace('_', '-');
    }
    init(locale) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.inited) {
                throw new Error('i18n already initialized.');
            }
            if (this.supportedTranslationLocales == null || this.supportedTranslationLocales.length === 0) {
                throw new Error('supportedTranslationLocales not set.');
            }
            this.inited = true;
            this.locale = this.translationLocale = locale != null ? locale : this.systemLanguage;
            try {
                this.collator = new Intl.Collator(this.locale, { numeric: true, sensitivity: 'base' });
            }
            catch (_a) {
                this.collator = null;
            }
            if (this.supportedTranslationLocales.indexOf(this.translationLocale) === -1) {
                this.translationLocale = this.translationLocale.slice(0, 2);
                if (this.supportedTranslationLocales.indexOf(this.translationLocale) === -1) {
                    this.translationLocale = this.supportedTranslationLocales[0];
                }
            }
            if (this.localesDirectory != null) {
                yield this.loadMessages(this.translationLocale, this.localeMessages);
                if (this.translationLocale !== this.supportedTranslationLocales[0]) {
                    yield this.loadMessages(this.supportedTranslationLocales[0], this.defaultMessages);
                }
            }
        });
    }
    t(id, p1, p2, p3) {
        return this.translate(id, p1, p2, p3);
    }
    translate(id, p1, p2, p3) {
        let result;
        if (this.localeMessages.hasOwnProperty(id) && this.localeMessages[id]) {
            result = this.localeMessages[id];
        }
        else if (this.defaultMessages.hasOwnProperty(id) && this.defaultMessages[id]) {
            result = this.defaultMessages[id];
        }
        else {
            result = '';
        }
        if (result !== '') {
            if (p1 != null) {
                result = result.split('__$1__').join(p1);
            }
            if (p2 != null) {
                result = result.split('__$2__').join(p2);
            }
            if (p3 != null) {
                result = result.split('__$3__').join(p3);
            }
        }
        return result;
    }
    loadMessages(locale, messagesObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const formattedLocale = locale.replace('-', '_');
            const locales = yield this.getLocalesJson(formattedLocale);
            for (const prop in locales) {
                if (!locales.hasOwnProperty(prop)) {
                    continue;
                }
                messagesObj[prop] = locales[prop].message;
                if (locales[prop].placeholders) {
                    for (const placeProp in locales[prop].placeholders) {
                        if (!locales[prop].placeholders.hasOwnProperty(placeProp) ||
                            !locales[prop].placeholders[placeProp].content) {
                            continue;
                        }
                        const replaceToken = '\\$' + placeProp.toUpperCase() + '\\$';
                        let replaceContent = locales[prop].placeholders[placeProp].content;
                        if (replaceContent === '$1' || replaceContent === '$2' || replaceContent === '$3') {
                            replaceContent = '__$' + replaceContent + '__';
                        }
                        messagesObj[prop] = messagesObj[prop].replace(new RegExp(replaceToken, 'g'), replaceContent);
                    }
                }
            }
        });
    }
}
exports.I18nService = I18nService;
//# sourceMappingURL=i18n.service.js.map