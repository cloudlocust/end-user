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
     *
     * @param value Switch consumption button type.
     */
    setConsumptionToggleButton: (value: SwitchConsumptionButtonTypeEnum) => void
}
