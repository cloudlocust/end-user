/**
 * Enum representing the types of switch consumption buttons.
 */
export enum SwitchConsumptionButtonTypeEnum {
    /**
     * Type of Consumption button.
     */
    Consumption = 'consumption',
    /**
     * Type of Auto consumption & Production button.
     */
    AutoconsmptionProduction = 'autoconsmption-production',
    /**
     * Type of Idle button.
     */
    Idle = 'idle',
}

/**
 * Enum representing the labels of switch consumption buttons.
 */
export enum SwitchConsumptionButtonLabelEnum {
    /**
     * Label for Consumption.
     */
    General = 'Ma Conso',
    /**
     * Label for Auto consumption & Production.
     */
    AutoconsmptionProduction = 'Autoconso | Production',
    /**
     * Label for Idle.
     */
    Idle = 'Veille',
}

/**
 * Type representing the switch consumption button element.
 */
export type SwitchConsumptionButtonElement =
    /**
     * Object representing the switch consumption button element.
     */
    {
        /**
         * Type of button.
         */
        type: SwitchConsumptionButtonTypeEnum
        /**
         * Label of button.
         */
        label: SwitchConsumptionButtonLabelEnum
    }

/**
 * Type representing the switch consumption button.
 */
export type SwitchConsumpytionButtonType =
    /**
     * Array of buttons.
     */
    SwitchConsumptionButtonElement[]

/**
 * Interface for SwitchIdleConsumptionProps.
 */
export interface SwitchConsumptionButtonProps {
    /**
     * Handle the click event on the switch consumption button.
     *
     * @param switchConsumptionButtonTypeEnum Indicates which button should will be active.
     * @returns Void.
     */
    onSwitchConsumptionButton: (switchConsumptionButtonTypeEnum: SwitchConsumptionButtonTypeEnum) => void
    /**
     * Indicates if the veille is shown.
     */
    isIdleShown: boolean
    /**
     * Indicates if the auto consumption & production is shown.
     */
    isAutoConsumptionProductionShown: boolean
}
