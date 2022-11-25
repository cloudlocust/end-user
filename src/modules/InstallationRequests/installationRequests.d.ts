/**
 * The type of the equipmentType.
 */
export type equipmentTypeT = 'INVERTER' | 'DEMOTIC' | 'OTHER' | 'SOLAR'

/**
 * Installation Request Status type.
 */
export type statusType = 'NEW' | 'PENDING' | 'CLOSED' | 'CANCELED'

/**
 * Installation requests type.
 */
export type IInstallationRequests = IInstallationRequest[] | []

/**
 * Model for one Installation request.
 */
export interface IInstallationRequest {
    /**
     * Id of the Installation Request.
     */
    id: number
    /**
     * Equipment Type of the installation request.
     */
    equipmentType: equipmentTypeT
    /**
     * Equipment Brand of the installation request.
     */
    equipmentBrand: string
    /**
     * Equipment Model of the installation request.
     */
    equipmentModel: string
    /**
     * Creation Date of the installation request.
     */
    createdAt?: string
    /**
     * Update Date of the installation request.
     */
    updatedAt?: string
    /**
     * Budget of the installation request.
     */
    budget: number
    /**
     * Comment of the installation request.
     */
    comment: string
    /**
     * Status of the installation request.
     */
    status: statusType
}

/**
 * Type for create installation request.
 */
export type createInstallationRequestType = Omit<IInstallationRequest, 'id' | 'createdAt' | 'updatedAt'>

/**
 * Type for update installation request.
 */
export type updateInstallationRequestType = Omit<IInstallationRequest, 'updatedAt' | 'id'>
