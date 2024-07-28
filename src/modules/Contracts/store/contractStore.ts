import { contractFormValuesType } from 'src/modules/Contracts/contractsTypes'
import { create } from 'zustand'

/**
 * Contract form type.
 */
export enum ContractFormTypeEnum {
    /**
     * Regular contract form type.
     */
    Regular = 'Regular',
    /**
     * Custom contract form type.
     */
    Custom = 'Custom',
}

/**
 * Contract store inteface.
 */
interface IContractStore {
    /**
     * Contract form type.
     */
    contractFormType: ContractFormTypeEnum
    /**
     * Set contract form type.
     *
     * @param value Contract form type.
     */
    setContractFormType: (value: ContractFormTypeEnum) => void
    /**
     * Set default value.
     */
    setDefaultContractFormType: () => void
    /**
     * Form data.
     */
    formData: Partial<contractFormValuesType> | null
    /**
     * Setter function to extract form data from the form.
     */
    setFormData: (data: Partial<contractFormValuesType>) => Partial<contractFormValuesType>
}

/**
 * Contract store.
 */
export const useContractStore = create<IContractStore>()((set) => ({
    contractFormType: ContractFormTypeEnum.Regular,
    /**
     * Set contract form type.
     *
     * @param value ContractFormType.
     * @returns New value of contractFormType.
     */
    setContractFormType: (value) => set(() => ({ contractFormType: value })),
    /**
     * Set default value.
     *
     * @returns Void.
     */
    setDefaultContractFormType: () => set(() => ({ contractFormType: ContractFormTypeEnum.Regular })),
    /**
     * Setter function to extract form data from the form.
     *
     * @param data Form data.
     * @returns Void.
     */
    formData: null,
    /**
     * Set form data.
     *
     * @param data Data to set.
     * @returns New data.
     */
    setFormData: (data: Partial<contractFormValuesType>) => {
        set((state) => ({
            ...state,
            formData: data,
        }))
        return data
    },
}))
