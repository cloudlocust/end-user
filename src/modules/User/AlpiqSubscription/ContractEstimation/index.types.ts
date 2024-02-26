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
    value: 'BASE' | 'HPHC' | number
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

//eslint-disable-next-line
export const AlpiqPowerValuesSelectOptions: { value: number, label: string}[] = Array.from({length: 34}, (_, index) => ({
        value: index + 3,
        label: `${index + 3} kva`,
    }),
)
