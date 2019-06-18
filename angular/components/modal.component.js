"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const messaging_service_1 = require("../../abstractions/messaging.service");
let ModalComponent = class ModalComponent {
    constructor(componentFactoryResolver, messagingService) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.messagingService = messagingService;
        this.onClose = new core_1.EventEmitter();
        this.onClosed = new core_1.EventEmitter();
        this.onShow = new core_1.EventEmitter();
        this.onShown = new core_1.EventEmitter();
        this.parentContainer = null;
        this.fade = true;
    }
    ngOnDestroy() {
        document.body.classList.remove('modal-open');
        document.body.removeChild(document.querySelector('.modal-backdrop'));
    }
    show(type, parentContainer, fade = true) {
        this.onShow.emit();
        this.messagingService.send('modalShow');
        this.parentContainer = parentContainer;
        this.fade = fade;
        document.body.classList.add('modal-open');
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop' + (this.fade ? ' fade' : '');
        document.body.appendChild(backdrop);
        const factory = this.componentFactoryResolver.resolveComponentFactory(type);
        const componentRef = this.container.createComponent(factory);
        document.querySelector('.modal-dialog').addEventListener('click', (e) => {
            e.stopPropagation();
        });
        const modals = Array.from(document.querySelectorAll('.modal, .modal *[data-dismiss="modal"]'));
        for (const closeElement of modals) {
            closeElement.addEventListener('click', (event) => {
                this.close();
            });
        }
        this.onShown.emit();
        this.messagingService.send('modalShown');
        return componentRef.instance;
    }
    close() {
        this.onClose.emit();
        this.messagingService.send('modalClose');
        this.onClosed.emit();
        this.messagingService.send('modalClosed');
        if (this.parentContainer != null) {
            this.parentContainer.clear();
        }
    }
};
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ModalComponent.prototype, "onClose", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ModalComponent.prototype, "onClosed", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ModalComponent.prototype, "onShow", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ModalComponent.prototype, "onShown", void 0);
__decorate([
    core_1.ViewChild('container', { read: core_1.ViewContainerRef }),
    __metadata("design:type", core_1.ViewContainerRef)
], ModalComponent.prototype, "container", void 0);
ModalComponent = __decorate([
    core_1.Component({
        selector: 'app-modal',
        template: `<ng-template #container></ng-template>`,
    }),
    __metadata("design:paramtypes", [core_1.ComponentFactoryResolver,
        messaging_service_1.MessagingService])
], ModalComponent);
exports.ModalComponent = ModalComponent;
//# sourceMappingURL=modal.component.js.map