import { TypographyProps } from '@mui/material/Typography'

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
}
