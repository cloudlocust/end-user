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
 * Type for create installation request.
 */
export type createSolarEquipmentType = Omit<ISolarEquipment, 'id'>

/**
 * Type for update installation request.
 */
export type updateSolarEquipmentType = Omit<ISolarEquipment, 'id'>
