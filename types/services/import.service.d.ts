import { ApiService } from '../abstractions/api.service';
import { CipherService } from '../abstractions/cipher.service';
import { CollectionService } from '../abstractions/collection.service';
import { FolderService } from '../abstractions/folder.service';
import { I18nService } from '../abstractions/i18n.service';
import { ImportOption, ImportService as ImportServiceAbstraction } from '../abstractions/import.service';
import { Importer } from '../importers/importer';
export declare class ImportService implements ImportServiceAbstraction {
    private cipherService;
    private folderService;
    private apiService;
    private i18nService;
    private collectionService;
    featuredImportOptions: {
        id: string;
        name: string;
    }[];
    regularImportOptions: ImportOption[];
    constructor(cipherService: CipherService, folderService: FolderService, apiService: ApiService, i18nService: I18nService, collectionService: CollectionService);
    getImportOptions(): ImportOption[];
    import(importer: Importer, fileContents: string, organizationId?: string): Promise<Error>;
    getImporter(format: string, organization?: boolean): Importer;
    private getImporterInstance;
    private postImport;
    private badData;
}
