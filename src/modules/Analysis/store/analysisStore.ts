import { create } from 'zustand'
import { IAnalysisState } from 'src/modules/Analysis/analysisTypes'

/**
 * Analysis Global State store.
 */
export const useAnalysisStore = create<IAnalysisState>()((set) => ({
    totalConsumption: 0,
    setTotalConsumption:
        // eslint-disable-next-line jsdoc/require-jsdoc
        (val) => set(() => ({ totalConsumption: val })),
}))
