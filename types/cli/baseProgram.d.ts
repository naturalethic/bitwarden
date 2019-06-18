import { Response } from './models/response';
import { UserService } from '../abstractions/user.service';
export declare abstract class BaseProgram {
    private userService;
    private writeLn;
    constructor(userService: UserService, writeLn: (s: string, finalLine: boolean, error: boolean) => void);
    protected processResponse(response: Response, exitImmediately?: boolean, dataProcessor?: () => string): void;
    protected getJson(obj: any): string;
    protected getMessage(response: Response): string;
    protected exitIfAuthed(): Promise<void>;
    protected exitIfNotAuthed(): Promise<void>;
}
