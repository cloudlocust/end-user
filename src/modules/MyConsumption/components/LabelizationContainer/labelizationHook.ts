import { useState, useCallback } from 'react'
import { AxiosResponse } from 'axios'
import { axios } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import {
    addActivityRequestBodyType,
    ConsumptionLabelDataType,
} from 'src/modules/MyConsumption/components/LabelizationContainer/labelizaitonTypes.types'

// eslint-disable-next-line jsdoc/require-jsdoc
export const HOUSING_ACTIVITIES_API = (housingId: number) => `${HOUSING_API}/${housingId}/activities`
/**
 * Default error message for get activities.
 */
export const TEST_GET_ACTIVITIES_DEFAULT_ERROR_MESSAGE = 'Erreur lors du chargement de vos labels'
/**
 * Default error message for add activity.
 */
export const TEST_ADD_ACTIVITY_DEFAULT_ERROR_MESSAGE = "Erreur lors de l'enregistrement du label"
/**
 * Success message for add activity.
 */
export const TEST_ADD_ACTIVITY_SUCCESS_MESSAGE = 'Label enregistrée avec succès'

/**
`* Hooks for labelization.
 *
 * @param housingId Indicate the id of the meter.
 * @returns UseLabelization Hook.
 */
export const useLabelization = (housingId?: number) => {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [isGetActivitiesLoading, setIsGetActivitiesLoading] = useState(false)
    const [activitiesList, setActivitiesList] = useState<ConsumptionLabelDataType[] | null>(null)
    const [isAddActivityLoading, setIsAddActivityLoading] = useState(false)

    /**
     * Get activities function.
     */
    const getActivitiesList = useCallback(async () => {
        if (!housingId) return
        setIsGetActivitiesLoading(true)
        try {
            const { data: activitiesList, status } = await axios.get<ConsumptionLabelDataType[]>(
                HOUSING_ACTIVITIES_API(housingId),
            )
            if (status === 200) {
                setActivitiesList(activitiesList)
            }
        } catch (error: any) {
            enqueueSnackbar(
                error?.response?.data?.detail
                    ? formatMessage({
                          id: error.response.data.detail,
                          defaultMessage: error.response.data.detail,
                      })
                    : formatMessage({
                          id: TEST_GET_ACTIVITIES_DEFAULT_ERROR_MESSAGE,
                          defaultMessage: TEST_GET_ACTIVITIES_DEFAULT_ERROR_MESSAGE,
                      }),
                { variant: 'error' },
            )
        }
        setIsGetActivitiesLoading(false)
    }, [enqueueSnackbar, formatMessage, housingId])

    /**
     * Add activity function.
     *
     * @returns The created activity.
     */
    const addActivity = useCallback(
        async (body: addActivityRequestBodyType) => {
            if (!housingId) return
            setIsAddActivityLoading(true)
            try {
                const { data: createdActivity, status } = await axios.post<
                    addActivityRequestBodyType,
                    AxiosResponse<ConsumptionLabelDataType>
                >(HOUSING_ACTIVITIES_API(housingId), body)

                if (status === 201) {
                    await getActivitiesList()
                    enqueueSnackbar(
                        formatMessage({
                            id: TEST_ADD_ACTIVITY_SUCCESS_MESSAGE,
                            defaultMessage: TEST_ADD_ACTIVITY_SUCCESS_MESSAGE,
                        }),
                        { variant: 'success' },
                    )
                    return createdActivity
                }
            } catch (error: any) {
                enqueueSnackbar(
                    error?.response?.data?.detail
                        ? formatMessage({
                              id: error.response.data.detail,
                              defaultMessage: error.response.data.detail,
                          })
                        : formatMessage({
                              id: TEST_ADD_ACTIVITY_DEFAULT_ERROR_MESSAGE,
                              defaultMessage: TEST_ADD_ACTIVITY_DEFAULT_ERROR_MESSAGE,
                          }),
                    { variant: 'error' },
                )
            } finally {
                setIsAddActivityLoading(false)
            }
        },
        [enqueueSnackbar, formatMessage, getActivitiesList, housingId],
    )

    return {
        isGetActivitiesLoading,
        activitiesList,
        isAddActivityLoading,
        getActivitiesList,
        addActivity,
    }
}
