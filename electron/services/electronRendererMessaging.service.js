"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
class ElectronRendererMessagingService {
    constructor(broadcasterService) {
        this.broadcasterService = broadcasterService;
        electron_1.ipcRenderer.on('messagingService', (event, message) => __awaiter(this, void 0, void 0, function* () {
            if (message.command) {
                this.sendMessage(message.command, message, false);
            }
        }));
    }
    send(subscriber, arg = {}) {
        this.sendMessage(subscriber, arg, true);
    }
    sendMessage(subscriber, arg = {}, toMain) {
        const message = Object.assign({}, { command: subscriber }, arg);
        this.broadcasterService.send(message);
        if (toMain) {
            electron_1.ipcRenderer.send('messagingService', message);
        }
    }
}
exports.ElectronRendererMessagingService = ElectronRendererMessagingService;
//# sourceMappingURL=electronRendererMessaging.service.js.map