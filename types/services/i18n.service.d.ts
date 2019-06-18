import { I18nService as I18nServiceAbstraction } from '../abstractions/i18n.service';
export declare class I18nService implements I18nServiceAbstraction {
    protected systemLanguage: string;
    protected localesDirectory: string;
    protected getLocalesJson: (formattedLocale: string) => Promise<any>;
    locale: string;
    supportedTranslationLocales: string[];
    translationLocale: string;
    collator: Intl.Collator;
    protected inited: boolean;
    protected defaultMessages: any;
    protected localeMessages: any;
    constructor(systemLanguage: string, localesDirectory: string, getLocalesJson: (formattedLocale: string) => Promise<any>);
    init(locale?: string): Promise<void>;
    t(id: string, p1?: string, p2?: string, p3?: string): string;
    translate(id: string, p1?: string, p2?: string, p3?: string): string;
    private loadMessages;
}
