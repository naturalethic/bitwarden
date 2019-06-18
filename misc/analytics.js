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
const constants_service_1 = require("../services/constants.service");
const deviceType_1 = require("../enums/deviceType");
const GaObj = 'ga';
exports.AnalyticsIds = {
    [deviceType_1.DeviceType.ChromeExtension]: 'UA-81915606-6',
    [deviceType_1.DeviceType.FirefoxExtension]: 'UA-81915606-7',
    [deviceType_1.DeviceType.OperaExtension]: 'UA-81915606-8',
    [deviceType_1.DeviceType.EdgeExtension]: 'UA-81915606-9',
    [deviceType_1.DeviceType.VivaldiExtension]: 'UA-81915606-15',
    [deviceType_1.DeviceType.SafariExtension]: 'UA-81915606-16',
    [deviceType_1.DeviceType.WindowsDesktop]: 'UA-81915606-17',
    [deviceType_1.DeviceType.LinuxDesktop]: 'UA-81915606-19',
    [deviceType_1.DeviceType.MacOsDesktop]: 'UA-81915606-18',
};
class Analytics {
    constructor(win, gaFilter, platformUtilsService, storageService, appIdService, dependencyResolver) {
        this.gaFilter = gaFilter;
        this.platformUtilsService = platformUtilsService;
        this.storageService = storageService;
        this.appIdService = appIdService;
        this.dependencyResolver = dependencyResolver;
        this.gaTrackingId = null;
        this.defaultDisabled = false;
        if (dependencyResolver != null) {
            const deps = dependencyResolver();
            if (platformUtilsService == null && deps.platformUtilsService) {
                this.platformUtilsService = deps.platformUtilsService;
            }
            if (storageService == null && deps.storageService) {
                this.storageService = deps.storageService;
            }
            if (appIdService == null && deps.appIdService) {
                this.appIdService = deps.appIdService;
            }
        }
        this.appVersion = this.platformUtilsService.getApplicationVersion();
        this.defaultDisabled = this.platformUtilsService.getDevice() === deviceType_1.DeviceType.FirefoxExtension ||
            this.platformUtilsService.isMacAppStore();
        this.gaTrackingId = this.platformUtilsService.analyticsId();
        win.GoogleAnalyticsObject = GaObj;
        win[GaObj] = (action, param1, param2) => __awaiter(this, void 0, void 0, function* () {
            yield this.ga(action, param1, param2);
        });
    }
    ga(action, param1, param2) {
        return __awaiter(this, void 0, void 0, function* () {
            return;
            if (this.gaFilter != null && this.gaFilter()) {
                return;
            }
            const disabled = yield this.storageService.get(constants_service_1.ConstantsService.disableGaKey);
            if ((this.defaultDisabled && disabled == null) || disabled != null && disabled) {
                return;
            }
            if (action !== 'send' || !param1) {
                return;
            }
            const gaAnonAppId = yield this.appIdService.getAnonymousAppId();
            const version = encodeURIComponent(this.appVersion);
            let message = 'v=1&tid=' + this.gaTrackingId + '&cid=' + gaAnonAppId + '&cd1=' + version;
            if (param1 === 'pageview' && param2) {
                message += this.gaTrackPageView(param2);
            }
            else if (typeof param1 === 'object' && param1.hitType === 'pageview') {
                message += this.gaTrackPageView(param1.page);
            }
            else if (param1 === 'event' && param2) {
                message += this.gaTrackEvent(param2);
            }
            else if (typeof param1 === 'object' && param1.hitType === 'event') {
                message += this.gaTrackEvent(param1);
            }
            const request = new XMLHttpRequest();
            request.open('POST', 'https://www.google-analytics.com/collect', true);
            request.send(message);
        });
    }
    gaTrackEvent(options) {
        return '&t=event&ec=' + (options.eventCategory ? encodeURIComponent(options.eventCategory) : 'Event') +
            '&ea=' + encodeURIComponent(options.eventAction) +
            (options.eventLabel ? '&el=' + encodeURIComponent(options.eventLabel) : '') +
            (options.eventValue ? '&ev=' + encodeURIComponent(options.eventValue) : '') +
            (options.page ? '&dp=' + this.cleanPagePath(options.page) : '');
    }
    gaTrackPageView(pagePath) {
        return '&t=pageview&dp=' + this.cleanPagePath(pagePath);
    }
    cleanPagePath(pagePath) {
        const paramIndex = pagePath.indexOf('?');
        if (paramIndex > -1) {
            pagePath = pagePath.substring(0, paramIndex);
        }
        if (pagePath.indexOf('!/') === 0 || pagePath.indexOf('#/') === 0) {
            pagePath = pagePath.substring(1);
        }
        const pathParts = pagePath.split('/');
        const newPathParts = [];
        pathParts.forEach((p) => {
            if (p.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
                newPathParts.push('__guid__');
            }
            else {
                newPathParts.push(p);
            }
        });
        return encodeURIComponent(newPathParts.join('/'));
    }
}
exports.Analytics = Analytics;
//# sourceMappingURL=analytics.js.map