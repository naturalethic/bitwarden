import { CryptoService } from '../abstractions/crypto.service';
export declare class ContainerService {
    private cryptoService;
    constructor(cryptoService: CryptoService);
    attachToWindow(win: any): void;
    attachToGlobal(global: any): void;
    getCryptoService(): CryptoService;
}
