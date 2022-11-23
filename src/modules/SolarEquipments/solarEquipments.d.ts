import { equipmentTypeT } from 'src/modules/InstallationRequests/installationRequests'

/**
 * Equipment requests type.
 */
export type ISolarEquipments = ISolarEquipment[] | []

/**
 * Model for one Equipment request.
 */
export interface ISolarEquipment {
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
 * Type for update installation request.
 */
export type solarEquipmentInputType = Omit<ISolarEquipment, 'id'>
