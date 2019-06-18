import { CardView } from '../view/cardView';
export declare class Card {
    static template(): Card;
    static toView(req: Card, view?: CardView): CardView;
    cardholderName: string;
    brand: string;
    number: string;
    expMonth: string;
    expYear: string;
    code: string;
    constructor(o?: CardView);
}
