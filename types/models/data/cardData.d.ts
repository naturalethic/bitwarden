import { CardApi } from '../api/cardApi';
export declare class CardData {
    cardholderName: string;
    brand: string;
    number: string;
    expMonth: string;
    expYear: string;
    code: string;
    constructor(data?: CardApi);
}
