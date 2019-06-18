"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StateService {
    constructor() {
        this.state = {};
    }
    get(key) {
        if (this.state.hasOwnProperty(key)) {
            return Promise.resolve(this.state[key]);
        }
        return Promise.resolve(null);
    }
    save(key, obj) {
        this.state[key] = obj;
        return Promise.resolve();
    }
    remove(key) {
        delete this.state[key];
        return Promise.resolve();
    }
    purge() {
        this.state = {};
        return Promise.resolve();
    }
}
exports.StateService = StateService;
//# sourceMappingURL=state.service.js.map