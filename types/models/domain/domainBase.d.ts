import { View } from '../view/view';
export default class Domain {
    protected buildDomainModel<D extends Domain>(domain: D, dataObj: any, map: any, alreadyEncrypted: boolean, notEncList?: any[]): void;
    protected buildDataModel<D extends Domain>(domain: D, dataObj: any, map: any, notCipherStringList?: any[]): void;
    protected decryptObj<T extends View>(viewModel: T, map: any, orgId: string): Promise<T>;
}
