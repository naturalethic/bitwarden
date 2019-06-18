import { SecureNoteType } from '../../enums/secureNoteType';
import { SecureNoteView } from '../view/secureNoteView';
export declare class SecureNote {
    static template(): SecureNote;
    static toView(req: SecureNote, view?: SecureNoteView): SecureNoteView;
    type: SecureNoteType;
    constructor(o?: SecureNoteView);
}
