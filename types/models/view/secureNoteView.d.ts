import { SecureNoteType } from '../../enums/secureNoteType';
import { View } from './view';
import { SecureNote } from '../domain/secureNote';
export declare class SecureNoteView implements View {
    type: SecureNoteType;
    constructor(n?: SecureNote);
    readonly subTitle: string;
}
