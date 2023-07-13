import { TypographyProps } from '@mui/material/Typography'
import { SetStateAction } from 'react'
import { IEnedisSgeConsent, IEnphaseConsent } from 'src/modules/Consents/Consents'
import { IConnectedPlug } from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs.d'

/**
 * Interface for Sge Popup Props.
 */
export interface EnedisSgePopupProps {
    /**
     * Props relevant to Mui Typographu component.
     */
    TypographyProps?: TypographyProps
    /**
     * Text that is going to be clicked on to open the popup.
     */
    openEnedisSgeConsentText: string
    /**
     * House's id.
     */
    houseId?: number
    /**
     * Setter function that handles the parent enedisSgeConsent state.
     */
    createEnedisSgeConsent: Dispatch<SetStateAction<IEnedisSgeConsent | undefined>>
    /**
     * Enedis consent error message.
     */
    createEnedisSgeConsentError: boolean
    /**
     * Create enedis sge loading state.
     */
    isCreateEnedisSgeConsentLoading: boolean
}

/**
 * Enum for Enedis Sge popup steps. For better readibality.
 */
export enum EnedisSgePopupStepsEnum {
    /**
     * Step when the meter is being verified.
     */
    METER_VERIFICATION = 'METER_VERIFICATION',
    /**
     * Step when the user gives their consent for enedis.
     */
    ENEDIS_CONSENT_CREATION = 'ENEDIS_CONSENT_CREATION',
}

/**
 * Solar Production Consent Status Props.
 */
export interface ISolarProductionConsentStatusProps {
    /**
     * Solar Production Consent.
     */
    solarProductionConsent?: IEnphaseConsent
    /**
     * Enphase Link.
     */
    enphaseLink: string
    /**
     * Handler function Get Enphase Link.
     */
    getEnphaseLink: (housingId: number) => Promise<void>
    /**
     * Boolean indicating the progress state when loading solar production consent (whether from enphase or connected plug).
     */
    solarProductionConsentLoadingInProgress: boolean
    /**
     * Handler function to revoke Enphase Consent.
     */
    onRevokeEnphaseConsent: () => Promise<void>
}

/**
 * ConnectedPlugProductionConsentPopupProps Props.
 */
export interface IConnectedPlugProductionConsentPopupProps {
    /**
     * Callback on Close popup.
     */
    onClose?: () => void
}

/**
 * Select ConnectedPlug Production List.
 */
export interface ISelectConnectedPlugProductionList {
    /**
     * Connected Plug List.
     */
    connectedPlugList?: IConnectedPlug[]
    /**
     * Callback when selecting a connected plug.
     */
    onSubmit: (connectedPlugId: string) => void
}
