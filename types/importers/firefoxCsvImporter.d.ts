import { BaseImporter } from './baseImporter';
import { Importer } from './importer';
import { ImportResult } from '../models/domain/importResult';
export declare class FirefoxCsvImporter extends BaseImporter implements Importer {
    parse(data: string): ImportResult;
}
