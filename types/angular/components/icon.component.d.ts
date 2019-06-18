import { OnChanges } from '@angular/core';
import { CipherView } from '../../models/view/cipherView';
import { EnvironmentService } from '../../abstractions/environment.service';
import { StateService } from '../../abstractions/state.service';
export declare class IconComponent implements OnChanges {
    protected stateService: StateService;
    cipher: CipherView;
    icon: string;
    image: string;
    fallbackImage: string;
    imageEnabled: boolean;
    private iconsUrl;
    constructor(environmentService: EnvironmentService, stateService: StateService);
    ngOnChanges(): Promise<void>;
    readonly iconCode: string;
    protected load(): void;
    private setLoginIcon;
}
