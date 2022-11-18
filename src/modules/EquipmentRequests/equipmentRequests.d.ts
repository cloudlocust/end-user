import { equipmentTypeT } from 'src/modules/InstallationRequests/installationRequests'

/**
 * Equipment requests type.
 */
export type IEquipmentRequests = IEquipmentRequest[] | []

/**
 * Model for one Equipment request.
 */
export interface IEquipmentRequest {
    /**
     * Equipment request's id.
     */
    id: number
    /**
     * Installed at date.
     */
    installedAt: string
    /**
     * Equipment type.
     */
    type: equipmentTypeT
    /**
     * Equipment brand.
     */
    brand: string
    /**
     * Equipment reference.
     */
    reference: string
}

/**
 * Type for create installation request.
 */
export type createEquipmentRequestType = Omit<IEquipmentRequest, 'id' | 'createdAt' | 'updatedAt'>

/**
 * Type for update installation request.
 */
export type updateEquipmentRequestType = Omit<IInstallationRequest, 'createdAt' | 'updatedAt' | 'id'>
