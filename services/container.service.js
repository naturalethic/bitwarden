"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ContainerService {
    constructor(cryptoService) {
        this.cryptoService = cryptoService;
    }
    // deprecated, use attachToGlobal instead
    attachToWindow(win) {
        this.attachToGlobal(win);
    }
    attachToGlobal(global) {
        if (!global.bitwardenContainerService) {
            global.bitwardenContainerService = this;
        }
    }
    getCryptoService() {
        return this.cryptoService;
    }
}
exports.ContainerService = ContainerService;
//# sourceMappingURL=container.service.js.map