import { ITariffType } from 'src/hooks/CommercialOffer/CommercialOffers'

/**
 *
 */
export interface ContractSelectTariffTypesProps {
    /**
     * Label.
     */
    label: string
    /**
     * Button loading.
     */
    isButtonLoading: boolean
    /**
     * State of other field when submitted.
     */
    isOtherFieldSubmitted: boolean
    /**
     * On button click handler.
     */
    onButtonClick: ({
        name,
        housingId,
    }: /**
     */ {
        // eslint-disable-next-line jsdoc/require-jsdoc
        name: string
        // eslint-disable-next-line jsdoc/require-jsdoc
        housingId: number
    }) => Promise<ITariffType | undefined>
    // eslint-disable-next-line jsdoc/require-jsdoc
    onButtonClickParams?: {
        [key: string]: any
    }
}
