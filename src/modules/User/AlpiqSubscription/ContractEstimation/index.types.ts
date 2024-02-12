/**
 * Alpiq Contract Type Select Options Type.
 */
export interface AlpiqContractTypeSelectOptionsType {
    /**
     * Label.
     */
    label: string
    /**
     * Value.
     */
    value: 'BASE' | 'HPHC'
}

/**
 * Alpiq contract type select options.
 */
export const AlpiqContractTypeSelectOptions: AlpiqContractTypeSelectOptionsType[] = [
    {
        label: 'Base',
        value: 'BASE',
    },
    {
        label: 'Heures pleines / Heures creuses',
        value: 'HPHC',
    },
]
