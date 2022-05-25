import { IEquipment, postEquipmentInputType } from 'src/modules/Profile/components/Equipments/EquipmentsType'
import { useEffect, useState, useCallback, useRef } from 'react'
import { AxiosResponse } from 'axios'
import { axios } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { METERS_API } from 'src/modules/Meters/metersHook'

// Meter Equipments API
// eslint-disable-next-line jsdoc/require-jsdoc
export const EQUIPMENTS_API = (meterId: number) => `${METERS_API}/${meterId}/equipments`

/**
`* Hooks for equipmentList.
 *
 * @param meterId Indicate the id of the meter.
 * @returns UseEquipment Hook.
 */
export const useEquipmentList = (meterId: number) => {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const isInitialMount = useRef(true)
    const [loadingEquipmentInProgress, setLoadingEquipmentInProgress] = useState(false)
    const [equipmentList, setEquipmentList] = useState<IEquipment[] | null>(null)

    /**
     * Load Customers function responsing for fetching customersList.
     *
     * @returns The function returns a string message containing successful and errors message.
     */
    const loadEquipmentList = useCallback(async () => {
        setLoadingEquipmentInProgress(true)

        try {
            const { data: responseData } = await axios.get<IEquipment[]>(EQUIPMENTS_API(meterId))
            setEquipmentList(responseData)
        } catch (error) {
            enqueueSnackbar(
                formatMessage({
                    id: 'Erreur lors du chargement de vos équipments',
                    defaultMessage: 'Erreur lors du chargement de vos équipments',
                }),
                { variant: 'error' },
            )
        }
        setLoadingEquipmentInProgress(false)
    }, [meterId, formatMessage, enqueueSnackbar])

    // UseEffect executes on initial intantiation of useEquipmentList, responsible for loadEquipmentList on initialLoad.
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            loadEquipmentList()
        }
    }, [loadEquipmentList])

    /**
     * Save Equipment function.
     *
     * @param body Values for saving equipment.
     * @returns Equipments saved.
     */
    const saveEquipment = async (body: postEquipmentInputType) => {
        setLoadingEquipmentInProgress(true)
        try {
            const { data: responseData } = await axios.post<
                postEquipmentInputType,
                AxiosResponse<postEquipmentInputType>
            >(EQUIPMENTS_API(meterId), body)

            enqueueSnackbar(
                formatMessage({
                    id: "Succès lors de l'enregistrement de vos équipments",
                    defaultMessage: "Succès lors de l'enregistrement de vos équipments",
                }),
                { variant: 'success' },
            )
            setLoadingEquipmentInProgress(false)
            return responseData
        } catch (error: any) {
            enqueueSnackbar(
                error.response.data && error.response.data.detail
                    ? formatMessage({
                          id: error.response.data.detail,
                          defaultMessage: error.response.data.detail,
                      })
                    : formatMessage({
                          id: "Erreur lors de l'enregistrement de vos équipments",
                          defaultMessage: "Erreur lors de l'enregistrement de vos équipments",
                      }),
                { variant: 'error' },
            )
            setLoadingEquipmentInProgress(false)
        }
    }
    return {
        loadEquipmentList,
        loadingEquipmentInProgress,
        saveEquipment,
        equipmentList,
    }
}
