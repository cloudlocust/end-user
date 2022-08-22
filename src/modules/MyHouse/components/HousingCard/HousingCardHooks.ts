import { IMeter } from 'src/modules/Meters/Meters'
import { axios, catchError } from 'src/common/react-platform-components'
import { useSnackbar } from 'notistack'
import { useIntl } from 'src/common/react-platform-translation'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { useState } from 'react'

// eslint-disable-next-line
export const useMeterForHousing = (houseId: number) => {
    const [loadingInProgress, setLoadingInProgress] = useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()

    // eslint-disable-next-line
    const addMeter = async ( body: Omit<IMeter, 'id'>, reloadHousings: () => void ) => {
        setLoadingInProgress(true)
        try {
            const { data: responseData } = await axios.post(`${HOUSING_API}/${houseId}/meter`, body)

            enqueueSnackbar(
                formatMessage({
                    id: 'Compteur ajouté avec succès',
                    defaultMessage: 'Compteur ajouté avec succès',
                }),
                { variant: 'success' },
            )

            setLoadingInProgress(false)

            // if success reload housings before returning data.
            reloadHousings()

            return responseData
        } catch (error) {
            enqueueSnackbar(
                formatMessage({
                    id: "Erreur lors de l'ajout du compteur",
                    defaultMessage: "Erreur lors de l'ajout du compteur",
                }),
                { variant: 'error' },
            )

            setLoadingInProgress(false)
            throw catchError(error)
        }
    }

    return {
        addMeter,
        loadingInProgress,
    }
}
