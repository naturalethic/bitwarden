"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BroadcasterService {
    constructor() {
        this.subscribers = new Map();
    }
    send(message, id) {
        if (id != null) {
            if (this.subscribers.has(id)) {
                this.subscribers.get(id)(message);
            }
            return;
        }
        this.subscribers.forEach((value) => {
            value(message);
        });
    }
    subscribe(id, messageCallback) {
        if (this.subscribers.has(id)) {
            return;
        }
        this.subscribers.set(id, messageCallback);
    }
    unsubscribe(id) {
        if (this.subscribers.has(id)) {
            this.subscribers.delete(id);
        }
    }
}
exports.BroadcasterService = BroadcasterService;
//# sourceMappingURL=broadcaster.service.js.map