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
const chk = require("chalk");
const response_1 = require("./models/response");
const chalk = chk.default;
class BaseProgram {
    constructor(userService, writeLn) {
        this.userService = userService;
        this.writeLn = writeLn;
    }
    processResponse(response, exitImmediately = false, dataProcessor = null) {
        if (!response.success) {
            if (process.env.BW_QUIET !== 'true') {
                if (process.env.BW_RESPONSE === 'true') {
                    this.writeLn(this.getJson(response), true, true);
                }
                else {
                    this.writeLn(chalk.redBright(response.message), true, true);
                }
            }
            if (exitImmediately) {
                process.exit(1);
            }
            else {
                process.exitCode = 1;
            }
            return;
        }
        if (process.env.BW_RESPONSE === 'true') {
            this.writeLn(this.getJson(response), true, false);
        }
        else if (response.data != null) {
            let out = dataProcessor != null ? dataProcessor() : null;
            if (out == null) {
                if (response.data.object === 'string') {
                    const data = response.data.data;
                    if (data != null) {
                        out = data;
                    }
                }
                else if (response.data.object === 'list') {
                    out = this.getJson(response.data.data);
                }
                else if (response.data.object === 'message') {
                    out = this.getMessage(response);
                }
                else {
                    out = this.getJson(response.data);
                }
            }
            if (out != null && process.env.BW_QUIET !== 'true') {
                this.writeLn(out, true, false);
            }
        }
        if (exitImmediately) {
            process.exit(0);
        }
        else {
            process.exitCode = 0;
        }
    }
    getJson(obj) {
        if (process.env.BW_PRETTY === 'true') {
            return JSON.stringify(obj, null, '  ');
        }
        else {
            return JSON.stringify(obj);
        }
    }
    getMessage(response) {
        const message = response.data;
        if (process.env.BW_RAW === 'true') {
            return message.raw;
        }
        let out = '';
        if (message.title != null) {
            if (message.noColor) {
                out = message.title;
            }
            else {
                out = chalk.greenBright(message.title);
            }
        }
        if (message.message != null) {
            if (message.title != null) {
                out += '\n';
            }
            out += message.message;
        }
        return out.trim() === '' ? null : out;
    }
    exitIfAuthed() {
        return __awaiter(this, void 0, void 0, function* () {
            const authed = yield this.userService.isAuthenticated();
            if (authed) {
                const email = yield this.userService.getEmail();
                this.processResponse(response_1.Response.error('You are already logged in as ' + email + '.'), true);
            }
        });
    }
    exitIfNotAuthed() {
        return __awaiter(this, void 0, void 0, function* () {
            const authed = yield this.userService.isAuthenticated();
            if (!authed) {
                this.processResponse(response_1.Response.error('You are not logged in.'), true);
            }
        });
    }
}
exports.BaseProgram = BaseProgram;
//# sourceMappingURL=baseProgram.js.map