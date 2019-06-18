import { BaseImporter } from './baseImporter';
import { Importer } from './importer';
import { ImportResult } from '../models/domain/importResult';
export declare class KeePass2XmlImporter extends BaseImporter implements Importer {
    result: ImportResult;
    parse(data: string): ImportResult;
    traverse(node: Element, isRootNode: boolean, groupPrefixName: string): void;
}
