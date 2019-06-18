import { BaseImporter } from './baseImporter';
import { Importer } from './importer';
import { ImportResult } from '../models/domain/importResult';
export declare class LastPassCsvImporter extends BaseImporter implements Importer {
    parse(data: string): ImportResult;
    private buildBaseCipher;
    private parseCard;
    private parseIdentity;
    private parseSecureNote;
    private parseSecureNoteMapping;
}
