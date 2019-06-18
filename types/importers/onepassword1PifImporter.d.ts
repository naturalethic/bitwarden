import { BaseImporter } from './baseImporter';
import { Importer } from './importer';
import { ImportResult } from '../models/domain/importResult';
export declare class OnePassword1PifImporter extends BaseImporter implements Importer {
    result: ImportResult;
    parse(data: string): ImportResult;
    private processWinOpVaultItem;
    private processStandardItem;
    private parsePasswordHistory;
    private parseFields;
}
