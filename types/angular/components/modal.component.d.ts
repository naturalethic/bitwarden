import { ComponentFactoryResolver, EventEmitter, OnDestroy, Type, ViewContainerRef } from '@angular/core';
import { MessagingService } from '../../abstractions/messaging.service';
export declare class ModalComponent implements OnDestroy {
    protected componentFactoryResolver: ComponentFactoryResolver;
    protected messagingService: MessagingService;
    onClose: EventEmitter<{}>;
    onClosed: EventEmitter<{}>;
    onShow: EventEmitter<{}>;
    onShown: EventEmitter<{}>;
    container: ViewContainerRef;
    parentContainer: ViewContainerRef;
    fade: boolean;
    constructor(componentFactoryResolver: ComponentFactoryResolver, messagingService: MessagingService);
    ngOnDestroy(): void;
    show<T>(type: Type<T>, parentContainer: ViewContainerRef, fade?: boolean): T;
    close(): void;
}
