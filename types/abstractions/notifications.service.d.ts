import { EnvironmentService } from './environment.service';
export declare abstract class NotificationsService {
    init: (environmentService: EnvironmentService) => Promise<void>;
    updateConnection: (sync?: boolean) => Promise<void>;
    reconnectFromActivity: () => Promise<void>;
    disconnectFromInactivity: () => Promise<void>;
}
