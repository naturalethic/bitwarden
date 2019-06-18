import { BaseImporter } from './baseImporter';
import { Importer } from './importer';
import { ImportResult } from '../models/domain/importResult';
export declare class DashlaneJsonImporter extends BaseImporter implements Importer {
    private result;
    parse(data: string): ImportResult;
    private processAuth;
    private processIdentity;
    private processAddress;
    private processCard;
    private processNote;
}
