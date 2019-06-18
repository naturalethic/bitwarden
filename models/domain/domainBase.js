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
const cipherString_1 = require("./cipherString");
class Domain {
    buildDomainModel(domain, dataObj, map, alreadyEncrypted, notEncList = []) {
        for (const prop in map) {
            if (!map.hasOwnProperty(prop)) {
                continue;
            }
            const objProp = dataObj[(map[prop] || prop)];
            if (alreadyEncrypted === true || notEncList.indexOf(prop) > -1) {
                domain[prop] = objProp ? objProp : null;
            }
            else {
                domain[prop] = objProp ? new cipherString_1.CipherString(objProp) : null;
            }
        }
    }
    buildDataModel(domain, dataObj, map, notCipherStringList = []) {
        for (const prop in map) {
            if (!map.hasOwnProperty(prop)) {
                continue;
            }
            const objProp = domain[(map[prop] || prop)];
            if (notCipherStringList.indexOf(prop) > -1) {
                dataObj[prop] = objProp != null ? objProp : null;
            }
            else {
                dataObj[prop] = objProp != null ? objProp.encryptedString : null;
            }
        }
    }
    decryptObj(viewModel, map, orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            const self = this;
            for (const prop in map) {
                if (!map.hasOwnProperty(prop)) {
                    continue;
                }
                // tslint:disable-next-line
                (function (theProp) {
                    const p = Promise.resolve().then(() => {
                        const mapProp = map[theProp] || theProp;
                        if (self[mapProp]) {
                            return self[mapProp].decrypt(orgId);
                        }
                        return null;
                    }).then((val) => {
                        viewModel[theProp] = val;
                    });
                    promises.push(p);
                })(prop);
            }
            yield Promise.all(promises);
            return viewModel;
        });
    }
}
exports.default = Domain;
//# sourceMappingURL=domainBase.js.map