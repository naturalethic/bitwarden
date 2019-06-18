"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cardView_1 = require("../view/cardView");
class Card {
    static template() {
        const req = new Card();
        req.cardholderName = 'John Doe';
        req.brand = 'visa';
        req.number = '4242424242424242';
        req.expMonth = '04';
        req.expYear = '2023';
        req.code = '123';
        return req;
    }
    static toView(req, view = new cardView_1.CardView()) {
        view.cardholderName = req.cardholderName;
        view.brand = req.brand;
        view.number = req.number;
        view.expMonth = req.expMonth;
        view.expYear = req.expYear;
        view.code = req.code;
        return view;
    }
    constructor(o) {
        if (o == null) {
            return;
        }
        this.cardholderName = o.cardholderName;
        this.brand = o.brand;
        this.number = o.number;
        this.expMonth = o.expMonth;
        this.expYear = o.expYear;
        this.code = o.code;
    }
}
exports.Card = Card;
//# sourceMappingURL=card.js.map