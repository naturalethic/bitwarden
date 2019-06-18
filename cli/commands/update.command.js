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
const fetch = require("node-fetch");
const response_1 = require("../models/response");
const messageResponse_1 = require("../models/response/messageResponse");
class UpdateCommand {
    constructor(platformUtilsService, i18nService, repoName, executableName, showExtendedMessage) {
        this.platformUtilsService = platformUtilsService;
        this.i18nService = i18nService;
        this.repoName = repoName;
        this.executableName = executableName;
        this.showExtendedMessage = showExtendedMessage;
        this.inPkg = false;
        this.inPkg = !!process.pkg;
    }
    run(cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentVersion = this.platformUtilsService.getApplicationVersion();
            const response = yield fetch.default('https://api.github.com/repos/bitwarden/' +
                this.repoName + '/releases/latest');
            if (response.status === 200) {
                const responseJson = yield response.json();
                const res = new messageResponse_1.MessageResponse(null, null);
                const tagName = responseJson.tag_name;
                if (tagName === ('v' + currentVersion)) {
                    res.title = 'No update available.';
                    res.noColor = true;
                    return response_1.Response.success(res);
                }
                let downloadUrl = null;
                if (responseJson.assets != null) {
                    for (const a of responseJson.assets) {
                        const download = a.browser_download_url;
                        if (download == null) {
                            continue;
                        }
                        if (download.indexOf('.zip') === -1) {
                            continue;
                        }
                        if (process.platform === 'win32' && download.indexOf(this.executableName + '-windows') > -1) {
                            downloadUrl = download;
                            break;
                        }
                        else if (process.platform === 'darwin' && download.indexOf(this.executableName + '-macos') > -1) {
                            downloadUrl = download;
                            break;
                        }
                        else if (process.platform === 'linux' && download.indexOf(this.executableName + '-linux') > -1) {
                            downloadUrl = download;
                            break;
                        }
                    }
                }
                res.title = 'A new version is available: ' + tagName;
                if (downloadUrl == null) {
                    downloadUrl = 'https://github.com/bitwarden/' + this.repoName + '/releases';
                }
                else {
                    res.raw = downloadUrl;
                }
                res.message = '';
                if (responseJson.body != null && responseJson.body !== '') {
                    res.message = responseJson.body + '\n\n';
                }
                res.message += 'You can download this update at ' + downloadUrl;
                if (this.showExtendedMessage) {
                    if (this.inPkg) {
                        res.message += '\n\nIf you installed this CLI through a package manager ' +
                            'you should probably update using its update command instead.';
                    }
                    else {
                        res.message += '\n\nIf you installed this CLI through NPM ' +
                            'you should update using `npm install -g @bitwarden/' + this.repoName + '`';
                    }
                }
                return response_1.Response.success(res);
            }
            else {
                return response_1.Response.error('Error contacting update API: ' + response.status);
            }
        });
    }
}
exports.UpdateCommand = UpdateCommand;
//# sourceMappingURL=update.command.js.map