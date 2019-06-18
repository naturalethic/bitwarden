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
const inquirer = require("inquirer");
const twoFactorProviderType_1 = require("../../enums/twoFactorProviderType");
const twoFactorEmailRequest_1 = require("../../models/request/twoFactorEmailRequest");
const response_1 = require("../models/response");
const messageResponse_1 = require("../models/response/messageResponse");
class LoginCommand {
    constructor(authService, apiService, i18nService) {
        this.authService = authService;
        this.apiService = apiService;
        this.i18nService = i18nService;
    }
    run(email, password, cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            if (email == null || email === '') {
                const answer = yield inquirer.createPromptModule({ output: process.stderr })({
                    type: 'input',
                    name: 'email',
                    message: 'Email address:',
                });
                email = answer.email;
            }
            if (email == null || email.trim() === '') {
                return response_1.Response.badRequest('Email address is required.');
            }
            if (email.indexOf('@') === -1) {
                return response_1.Response.badRequest('Email address is invalid.');
            }
            if (password == null || password === '') {
                const answer = yield inquirer.createPromptModule({ output: process.stderr })({
                    type: 'password',
                    name: 'password',
                    message: 'Master password:',
                });
                password = answer.password;
            }
            if (password == null || password === '') {
                return response_1.Response.badRequest('Master password is required.');
            }
            let twoFactorToken = cmd.code;
            let twoFactorMethod = null;
            try {
                if (cmd.method != null) {
                    twoFactorMethod = parseInt(cmd.method, null);
                }
            }
            catch (e) {
                return response_1.Response.error('Invalid two-step login method.');
            }
            try {
                if (this.validatedParams != null) {
                    yield this.validatedParams();
                }
                let response = null;
                if (twoFactorToken != null && twoFactorMethod != null) {
                    response = yield this.authService.logInComplete(email, password, twoFactorMethod, twoFactorToken, false);
                }
                else {
                    response = yield this.authService.logIn(email, password);
                    if (response.twoFactor) {
                        let selectedProvider = null;
                        const twoFactorProviders = this.authService.getSupportedTwoFactorProviders(null);
                        if (twoFactorProviders.length === 0) {
                            return response_1.Response.badRequest('No providers available for this client.');
                        }
                        if (twoFactorMethod != null) {
                            try {
                                selectedProvider = twoFactorProviders.filter((p) => p.type === twoFactorMethod)[0];
                            }
                            catch (e) {
                                return response_1.Response.error('Invalid two-step login method.');
                            }
                        }
                        if (selectedProvider == null) {
                            if (twoFactorProviders.length === 1) {
                                selectedProvider = twoFactorProviders[0];
                            }
                            else {
                                const options = twoFactorProviders.map((p) => p.name);
                                options.push(new inquirer.Separator());
                                options.push('Cancel');
                                const answer = yield inquirer.createPromptModule({ output: process.stderr })({
                                    type: 'list',
                                    name: 'method',
                                    message: 'Two-step login method:',
                                    choices: options,
                                });
                                const i = options.indexOf(answer.method);
                                if (i === (options.length - 1)) {
                                    return response_1.Response.error('Login failed.');
                                }
                                selectedProvider = twoFactorProviders[i];
                            }
                        }
                        if (twoFactorToken == null && response.twoFactorProviders.size > 1 &&
                            selectedProvider.type === twoFactorProviderType_1.TwoFactorProviderType.Email) {
                            const emailReq = new twoFactorEmailRequest_1.TwoFactorEmailRequest(this.authService.email, this.authService.masterPasswordHash);
                            yield this.apiService.postTwoFactorEmail(emailReq);
                        }
                        if (twoFactorToken == null) {
                            const answer = yield inquirer.createPromptModule({ output: process.stderr })({
                                type: 'input',
                                name: 'token',
                                message: 'Two-step login code:',
                            });
                            twoFactorToken = answer.token;
                            if (twoFactorToken == null || twoFactorToken === '') {
                                return response_1.Response.badRequest('Code is required.');
                            }
                        }
                        response = yield this.authService.logInTwoFactor(selectedProvider.type, twoFactorToken, false);
                    }
                }
                if (response.twoFactor) {
                    return response_1.Response.error('Login failed.');
                }
                if (this.success != null) {
                    const res = yield this.success();
                    return response_1.Response.success(res);
                }
                else {
                    const res = new messageResponse_1.MessageResponse('You are logged in!', null);
                    return response_1.Response.success(res);
                }
            }
            catch (e) {
                return response_1.Response.error(e);
            }
        });
    }
}
exports.LoginCommand = LoginCommand;
//# sourceMappingURL=login.command.js.map