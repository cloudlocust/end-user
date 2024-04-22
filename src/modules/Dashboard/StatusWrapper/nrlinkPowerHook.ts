import { UseQueryResult, useQuery } from 'react-query'
import { axios } from 'src/common/react-platform-components'
import { INrlinkMetrics } from 'src/modules/Dashboard/StatusWrapper/nrlinkPower'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { API_RESOURCES_URL } from 'src/configs'

// eslint-disable-next-line jsdoc/require-jsdoc
const NRLINK_POWER_URL = (housingId?: number) => `${API_RESOURCES_URL}/nrlink-last-metrics/${housingId}`

/**
 * Hook to fetch nrlink power data.
 *
 * @param housingId Housing id.
 * @returns Nrlink power data.
 */
export function useNrlinkMetrics(housingId?: number): UseQueryResult<INrlinkMetrics> {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()

    return useQuery<INrlinkMetrics>(
        ['nrlinkMetrics', housingId],
        async () => {
            const response = await axios.get<INrlinkMetrics>(NRLINK_POWER_URL(housingId))
            return response.data
        },
        {
            /**
             * On error.
             *
             * @param error Error.
             */
            onError: (error: any) => {
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors de la récupération des données de puissance',
                        defaultMessage: 'Erreur lors de la récupération des données de puissance',
                    }),
                    { variant: 'error' },
                )
                throw error
            },
            refetchInterval: 60000,
        },
    )
}
