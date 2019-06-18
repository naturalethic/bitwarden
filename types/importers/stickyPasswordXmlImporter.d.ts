import { BaseImporter } from './baseImporter';
import { Importer } from './importer';
import { ImportResult } from '../models/domain/importResult';
export declare class StickyPasswordXmlImporter extends BaseImporter implements Importer {
    parse(data: string): ImportResult;
    buildGroupText(doc: Document, groupId: string, groupText: string): string;
}
