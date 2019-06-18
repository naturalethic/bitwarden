"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cardData_1 = require("../data/cardData");
const domainBase_1 = require("./domainBase");
const cardView_1 = require("../view/cardView");
class Card extends domainBase_1.default {
    constructor(obj, alreadyEncrypted = false) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            cardholderName: null,
            brand: null,
            number: null,
            expMonth: null,
            expYear: null,
            code: null,
        }, alreadyEncrypted, []);
    }
    decrypt(orgId) {
        return this.decryptObj(new cardView_1.CardView(this), {
            cardholderName: null,
            brand: null,
            number: null,
            expMonth: null,
            expYear: null,
            code: null,
        }, orgId);
    }
    toCardData() {
        const c = new cardData_1.CardData();
        this.buildDataModel(this, c, {
            cardholderName: null,
            brand: null,
            number: null,
            expMonth: null,
            expYear: null,
            code: null,
        });
        return c;
    }
}
exports.Card = Card;
//# sourceMappingURL=card.js.map