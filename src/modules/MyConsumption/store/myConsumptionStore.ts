import { create } from 'zustand'
import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'
import { IMyConsumptionStore } from 'src/modules/MyConsumption/store/myConsumptionStore.types'

/**
 * My Consumption Store.
 */
export const useMyConsumptionStore = create<IMyConsumptionStore>()((set) => ({
    consumptionToggleButton: SwitchConsumptionButtonTypeEnum.Consumption,
    /**
     * Function to set consumption toggle button.
     *
     * @param value New value of consumption toggle button.
     * @returns New value of consumption toggle button.
     */
    setConsumptionToggleButton: (value) => set(() => ({ consumptionToggleButton: value })),
}))
