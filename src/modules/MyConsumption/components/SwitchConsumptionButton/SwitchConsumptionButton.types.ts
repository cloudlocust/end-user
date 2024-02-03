import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes.d'

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
    AutoconsmptionProduction = 'Auto-conso | Production',
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
     *
     * @param switchConsumptionButtonTypeEnum SwitchConsumptionButtonTypeEnum.
     * @returns Void.
     */
    onSwitchConsumptionButton: (switchConsumptionButtonTypeEnum: SwitchConsumptionButtonTypeEnum) => void
    /**
     * Indicate if IdleConsumptionTogglButton is disabled.
     */
    isIdleConsumptionButtonDisabled?: boolean
    /**
     * Callback when clicking the infoIcon on disabled idleConsumption button.
     */
    onClickIdleConsumptionDisabledInfoIcon: () => void
    /**
     *
     */
    period: periodType
    /**
     *
     */
    isSolarProductionConsentOff: boolean
}
