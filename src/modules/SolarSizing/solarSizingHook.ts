import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { useMutation, useQuery } from 'react-query'
import { axios } from 'src/common/react-platform-components'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import {
    AddUpdateSolarSizingType,
    AllHousingSolarSizingType,
    ISolarSizing,
} from 'src/modules/SolarSizing/solarSizeing.types'

// eslint-disable-next-line jsdoc/require-jsdoc
export const SOLAR_SIZING_URL = (housingId?: number) => `${HOUSING_API}/${housingId}/solar-sizing`

// eslint-disable-next-line jsdoc/require-jsdoc
export const HOUSING_SOLAR_SIZING_BY_SOLAR_SIZING_ID = (housingId: number, solarSizingId: number) =>
    `${HOUSING_API}/${housingId}/solar-sizing/${solarSizingId}` as const

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
const postSolarSizing = async (solarSizingUrl: string, newSolarSizing: AddUpdateSolarSizingType) => {
    return await axios.post<ISolarSizing>(solarSizingUrl, newSolarSizing)
}

/**
 * Custom hook to handle solar sizing.
 *
 * @param housingId Housing id.
 * @param solarSizingId Solarr sizing id.
 * @returns N/A.
 */
export const useSolarSizing = (housingId?: number, solarSizingId?: number) => {
    const solarSizingUrl = SOLAR_SIZING_URL(housingId)

    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()

    const addSolarSizing = useMutation(
        (newSolarSizing: AddUpdateSolarSizingType) => {
            return postSolarSizing(solarSizingUrl, newSolarSizing)
        },
        {
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

    const { data: allHousingSolarSizing, ...restOfAllHousingSolarSizingQuery } = useQuery(
        'getAllHousingSolarSizing',
        async () => {
            return await axios.get<AllHousingSolarSizingType>(solarSizingUrl)
        },
        {
            enabled: false, // This prevents the query from running on mount
        },
    )

    const { data: getHousingSolarSizingBySolarSizingId, ...restOfGetHousingSolarSizingBySolarSizingId } = useQuery(
        'getHousingSolarSizingBySolarSizingId',
        async () => {
            const housingSolarSizingBySolarSizingId = HOUSING_SOLAR_SIZING_BY_SOLAR_SIZING_ID(
                housingId!,
                solarSizingId!,
            )

            return await axios.get<ISolarSizing>(housingSolarSizingBySolarSizingId)
        },
        {
            enabled: false, // This prevents the query from running on mount
        },
    )

    const updateHousingSolarSizingBySolarSizingId = useMutation((updatedSolarSizing: AddUpdateSolarSizingType) => {
        const housingSolarSizingBySolarSizingId = HOUSING_SOLAR_SIZING_BY_SOLAR_SIZING_ID(housingId!, solarSizingId!)

        return axios.patch<AddUpdateSolarSizingType>(housingSolarSizingBySolarSizingId, updatedSolarSizing)
    })

    return {
        addSolarSizing,
        allHousingSolarSizing: { data: allHousingSolarSizing?.data, ...restOfAllHousingSolarSizingQuery },
        getHousingSolarSizingBySolarSizingId: {
            data: getHousingSolarSizingBySolarSizingId?.data,
            ...restOfGetHousingSolarSizingBySolarSizingId,
        },
        updateHousingSolarSizingBySolarSizingId,
    }
}
