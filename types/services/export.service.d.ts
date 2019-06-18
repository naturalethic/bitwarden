import { ApiService } from '../abstractions/api.service';
import { CipherService } from '../abstractions/cipher.service';
import { ExportService as ExportServiceAbstraction } from '../abstractions/export.service';
import { FolderService } from '../abstractions/folder.service';
export declare class ExportService implements ExportServiceAbstraction {
    private folderService;
    private cipherService;
    private apiService;
    constructor(folderService: FolderService, cipherService: CipherService, apiService: ApiService);
    getExport(format?: 'csv' | 'json'): Promise<string>;
    getOrganizationExport(organizationId: string, format?: 'csv' | 'json'): Promise<string>;
    getFileName(prefix?: string, extension?: string): string;
    private padNumber;
    private buildCommonCipher;
}
