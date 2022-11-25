import { TypographyProps } from '@mui/material/Typography'
import { SetStateAction } from 'react'
import { IEnedisSgeConsent } from 'src/modules/Consents/Consents'

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
