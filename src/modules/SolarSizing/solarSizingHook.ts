import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { useMutation, useQuery } from 'react-query'
import { axios } from 'src/common/react-platform-components'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { AddSolarSizing, HousingSolarSizing, ISolarSizing } from 'src/modules/SolarSizing/solarSizeing.types'

// eslint-disable-next-line jsdoc/require-jsdoc
export const SOLAR_SIZING_URL = (housingId?: number) => `${HOUSING_API}/${housingId}/solar-sizing`

/**
 * Solar sizing success message.
 */
export const ADD_SOLAR_SIZING_SUCCESS_MESSAGE = 'Potentiel solaire ajouté avec succès'

/**
 * Solar sizing error message.
 */
export const ADD_SOLAR_SIZING_ERROR_MESSAGE = "Erreur lors de l'ajout du potentiel solaire"

/**
 * Post solar sizing.
 *
 * @param solarSizingUrl Endpoint URL.
 * @param newSolarSizing New solar sizing.
 * @returns Axios response.
 */
const postSolarSizing = async (solarSizingUrl: string, newSolarSizing: AddSolarSizing) => {
    return await axios.post<ISolarSizing>(solarSizingUrl, newSolarSizing)
}

/**
 * Custom hook to handle solar sizing.
 *
 * @param housingId Housing id.
 * @returns N/A.
 */
export const useSolarSizing = (housingId?: number) => {
    const solarSizingUrl = SOLAR_SIZING_URL(housingId)
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()

    const addSolarSizing = useMutation(
        (newSolarSizing: AddSolarSizing) => {
            return postSolarSizing(solarSizingUrl, newSolarSizing)
        },
        {
            // /**
            //  * On success callback.
            //  *
            //  * @param response Axios response.
            //  */
            // onSuccess: (response) => {
            //     if (response.status === 201) {
            //         enqueueSnackbar(
            //             formatMessage({
            //                 id: ADD_SOLAR_SIZING_SUCCESS_MESSAGE,
            //                 defaultMessage: ADD_SOLAR_SIZING_SUCCESS_MESSAGE,
            //             }),
            //             { variant: 'success' },
            //         )
            //     }
            // },
            /**
             * On error callback.
             */
            onError: () => {
                enqueueSnackbar(
                    formatMessage({
                        id: ADD_SOLAR_SIZING_ERROR_MESSAGE,
                        defaultMessage: ADD_SOLAR_SIZING_ERROR_MESSAGE,
                    }),
                    { variant: 'error' },
                )
            },
        },
    )

    const { data: solarSizingData, ...restOfQuery } = useQuery(
        'getHousingSolarSizing',
        async () => {
            return await axios.get<HousingSolarSizing>(solarSizingUrl)
        },
        {
            // /**
            //  * On error callback.
            //  */
            // onError: () => {
            //     enqueueSnackbar(
            //         formatMessage({
            //             id: 'Erreur lors de la récupération des données des potentiel solaire',
            //             defaultMessage: 'Erreur lors de la récupération des potentiel solaire',
            //         }),
            //         { variant: 'error' },
            //     )
            // },
            // Only fetch the data if the housingId is defined
            enabled: Boolean(housingId),
            cacheTime: 1000 * 60 * 1,
        },
    )

    return {
        addSolarSizing,
        solarSizingData,
        ...restOfQuery,
    }
}
