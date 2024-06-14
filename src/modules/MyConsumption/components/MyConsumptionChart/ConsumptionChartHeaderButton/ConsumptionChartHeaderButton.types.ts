import { ButtonProps } from '@mui/material'

/**
 * ConsumptionChartHeaderButton Props.
 */
export interface ConsumptionChartHeaderButtonProps extends ButtonProps {
    /**
     * Icon to display in the button.
     */
    icon?: React.ReactNode | string
    /**
     * Text to display in the button.
     */
    text: string
    /**
     * Button background color in hex format.
     */
    buttonColor?: string
    /**
     * Button text color in hex format.
     */
    textColor?: string
    /**
     * Whether the button has a border.
     */
    hasBorder?: boolean
    /**
     * Border color in hex format.
     */
    borderColor?: string
    /**
     * Function to call when the button is clicked.
     */
    clickHandler: () => void
}
