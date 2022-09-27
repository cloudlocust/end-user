import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { metricRangeType } from 'src/modules/Metrics/Metrics'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { getHasMissingHousingContractsResponse } from 'src/modules/MyConsumption/myConsumptionTypes'

/**
 * Function returning GET_HAS_MISSING_HOUSING_CONTRACTS_API.
 *
 * @param housingId Housing Id.
 * @returns HasMissingHoussingContracts Api.
 */
export const getHasMissingHousingContractsApi = (housingId: IHousing['id']) =>
    `${HOUSING_API}/${housingId}/has_missing_housing_contracts`

/**
 * Custom Hook used in MyConsumptionContainer, for requested related to euroConsumption target (such as showing a message if the euroConsumption chart hasMissingHousingContracts).
 *
 * @param range Range to check if hasMissingContracts.
 * @param housingId Housing Id.
 * @returns UseMyConsumptionHooks.
 */
export const useMyConsumptionHooks = (range: metricRangeType, housingId?: IHousing['id']) => {
    const [hasMissingHousingContracts, setHasMissingHousingContracts] = useState<Boolean | null>(null)
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()

    /**
     * Get hasMissingHousingContracts Hook request handler.
     */
    const getHasMissingHousingContracts = useCallback(async () => {
        if (!housingId) return
        try {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const { data: responseData } = await axios.get<getHasMissingHousingContractsResponse>(
                `${getHasMissingHousingContractsApi(housingId)}?from=${range.from}&to=${range.to}`,
            )
            setHasMissingHousingContracts(responseData.hasMissingHousingContracts)
        } catch (error) {
            enqueueSnackbar(
                formatMessage({
                    id: 'Erreur lors de la récupération du méssage du contrat example',
                    defaultMessage: 'Erreur lors de la récupération du méssage du contrat example',
                }),
                { variant: 'error' },
            )
        }
    }, [housingId, enqueueSnackbar, formatMessage, range])

    useEffect(() => {
        getHasMissingHousingContracts()
    }, [getHasMissingHousingContracts])

    return {
        hasMissingHousingContracts,
    }
}
