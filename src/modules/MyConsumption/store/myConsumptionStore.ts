import { create } from 'zustand'
import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'
import { IMyConsumptionStore } from 'src/modules/MyConsumption/store/myConsumptionStore.types'

/**
 * My Consumption Store.
 */
export const useMyConsumptionStore = create<IMyConsumptionStore>()((set) => ({
    consumptionToggleButton: SwitchConsumptionButtonTypeEnum.Consumption,
    isPartiallyYearlyDataExist: true,
    /**
     * Function to set consumption toggle button.
     *
     * @param value New value of consumption toggle button.
     * @returns New value of consumption toggle button.
     */
    setConsumptionToggleButton: (value) => set(() => ({ consumptionToggleButton: value })),
    /**
     * Function to set the existence of partially yearly data.
     *
     * @param value New value indicating if partially yearly data exists.
     * @returns Void.
     */
    setPartiallyYearlyDataExist: (value) => set(() => ({ isPartiallyYearlyDataExist: value })),

    /**
     * Function to reset consumption toggle button to default value.
     *
     * @returns Default value of consumption toggle button.
     */
    resetToDefault: () => set(() => ({ consumptionToggleButton: SwitchConsumptionButtonTypeEnum.Consumption })),
    /**
     * Function to set the existence of partially yearly data.
     *
     * @param value New value indicating if partially yearly data exists.
     * @returns Void.
     */
    setPartiallyYearlyDataExist: (value) => set(() => ({ isPartiallyYearlyDataExist: value })),
}))
