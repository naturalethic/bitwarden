import { OrganizationUserType } from '../../enums/organizationUserType';
import { SelectionReadOnlyRequest } from './selectionReadOnlyRequest';
export declare class OrganizationUserUpdateRequest {
    type: OrganizationUserType;
    accessAll: boolean;
    collections: SelectionReadOnlyRequest[];
}
