import { equipmentTypeT } from 'src/modules/InstallationRequests/installationRequests'
import { Dispatch, SetStateAction } from 'react'

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

/**
 * Interface for ActionCell of @Table used in InstallationRequests.
 */
export interface ISolarEquipmentActionCellProps {
    /**
     * Current row to display.
     */
    row: IInstallationRequest
    /**
     * Callback to call after User clicked on remove Button.
     */
    onAfterCreateUpdateDeleteSuccess: () => void
    /**
     * Callback to call after User clicked on update Button. (Display a Popup).
     */
    setIsSolarEquipmentCreateUpdatePopupOpen: Dispatch<SetStateAction<boolean>>
    /**
     * Callback to call after User clicked on update Button. (Setup the Informations to pass to Popup).
     */
    setSolarEquipmentDetails: Dispatch<SetStateAction<ISolarEquipment | null>>
}
