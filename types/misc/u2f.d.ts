export declare class U2f {
    private win;
    private webVaultUrl;
    private successCallback;
    private errorCallback;
    private infoCallback;
    private iframe;
    private connectorLink;
    private parseFunction;
    constructor(win: Window, webVaultUrl: string, successCallback: Function, errorCallback: Function, infoCallback: Function);
    init(data: any): void;
    stop(): void;
    start(): void;
    sendMessage(message: any): void;
    base64Encode(str: string): string;
    cleanup(): void;
    private parseMessage;
    private validMessage;
}
