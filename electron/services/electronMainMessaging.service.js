"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ElectronMainMessagingService {
    constructor(windowMain, onMessage) {
        this.windowMain = windowMain;
        this.onMessage = onMessage;
    }
    send(subscriber, arg = {}) {
        const message = Object.assign({}, { command: subscriber }, arg);
        this.onMessage(message);
        if (this.windowMain.win != null) {
            this.windowMain.win.webContents.send('messagingService', message);
        }
    }
}
exports.ElectronMainMessagingService = ElectronMainMessagingService;
//# sourceMappingURL=electronMainMessaging.service.js.map