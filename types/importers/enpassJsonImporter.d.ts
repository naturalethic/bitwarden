import { BaseImporter } from './baseImporter';
import { Importer } from './importer';
import { ImportResult } from '../models/domain/importResult';
export declare class EnpassJsonImporter extends BaseImporter implements Importer {
    parse(data: string): ImportResult;
    private processLogin;
    private processCard;
    private processNote;
}
