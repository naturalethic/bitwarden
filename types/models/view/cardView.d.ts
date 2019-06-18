import { View } from './view';
import { Card } from '../domain/card';
export declare class CardView implements View {
    cardholderName: string;
    expMonth: string;
    expYear: string;
    code: string;
    private _brand;
    private _number;
    private _subTitle;
    constructor(c?: Card);
    readonly maskedCode: string;
    brand: string;
    number: string;
    readonly subTitle: string;
    readonly expiration: string;
    private formatYear;
}
