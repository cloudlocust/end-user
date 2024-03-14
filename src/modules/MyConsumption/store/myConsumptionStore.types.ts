import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'

/**
 * My Consumption Store.
 */
export interface IMyConsumptionStore {
    /**
     * Consumption toggle button.
     */
    consumptionToggleButton: SwitchConsumptionButtonTypeEnum
    /**
     * Indicates whether partially yearly data exists.
     */
    isPartiallyYearlyDataExist: boolean
    /**
     *
     * @param value Switch consumption button type.
     */
    setConsumptionToggleButton: (value: SwitchConsumptionButtonTypeEnum) => void

    /**
     * Set the value of isPartiallyYearlyDataExist.
     *
     * @param value The new value of isPartiallyYearlyDataExist.
     */
    setPartiallyYearlyDataExist: (value: boolean) => void

    /**
     * Reset consumption toggle button to default value.
     */
    resetToDefault: () => void
    /**
     * Set the value of isPartiallyYearlyDataExist.
     *
     * @param value The new value of isPartiallyYearlyDataExist.
     */
    setPartiallyYearlyDataExist: (value: boolean) => void
}
