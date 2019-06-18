import { I18nService } from '../abstractions/i18n.service';
import { WindowMain } from './window.main';
export declare class UpdaterMain {
    private i18nService;
    private windowMain;
    private gitHubProject;
    private onCheckingForUpdate;
    private onReset;
    private onUpdateDownloaded;
    private projectName;
    private doingUpdateCheck;
    private doingUpdateCheckWithFeedback;
    private canUpdate;
    constructor(i18nService: I18nService, windowMain: WindowMain, gitHubProject: string, onCheckingForUpdate: () => void, onReset: () => void, onUpdateDownloaded: () => void, projectName: string);
    init(): Promise<void>;
    checkForUpdate(withFeedback?: boolean): Promise<void>;
    private reset;
}
