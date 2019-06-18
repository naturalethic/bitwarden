import { IdentityView } from '../view/identityView';
export declare class Identity {
    static template(): Identity;
    static toView(req: Identity, view?: IdentityView): IdentityView;
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    address1: string;
    address2: string;
    address3: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    company: string;
    email: string;
    phone: string;
    ssn: string;
    username: string;
    passportNumber: string;
    licenseNumber: string;
    constructor(o?: IdentityView);
}
