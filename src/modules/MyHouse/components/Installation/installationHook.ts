import { addEquipmentType } from './InstallationType.d'
import {
    equipmentType,
    IEquipmentMeter,
    postEquipmentInputType,
} from 'src/modules/MyHouse/components/Installation/InstallationType'
import { useEffect, useState, useCallback, useRef } from 'react'
import { AxiosResponse } from 'axios'
import { axios } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { API_RESOURCES_URL } from 'src/configs'
import { equipmentsAccomodationFeatureState } from 'src/modules/MyHouse/MyHouseConfig'

// Housing Equipments API

// eslint-disable-next-line jsdoc/require-jsdoc
export const HOUSING_EQUIPMENTS_API = (housingId: number) => `${HOUSING_API}/${housingId}/equipments`

// eslint-disable-next-line jsdoc/require-jsdoc
export const ALL_EQUIPMENTS_API = `${API_RESOURCES_URL}/equipments`

/**
`* Hooks for equipmentList.
 *
 * @param housingId Indicate the id of the meter.
 * @returns UseEquipment Hook.
 */
export const useEquipmentList = (housingId?: number) => {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const isInitialMount = useRef(true)
    const [loadingEquipmentInProgress, setLoadingEquipmentInProgress] = useState(false)
    const [isEquipmentMeterListEmpty, setIsEquipmentMeterListEmpty] = useState(false)
    const [equipmentList, setEquipmentList] = useState<equipmentType[] | null>(null)
    const [housingEquipmentsList, setHousingEquipmentsList] = useState<IEquipmentMeter[] | null>(null)
    const [isaAdEquipmentLoading, setIsAddEquipmentLoading] = useState(false)

    /**
     * Load Customers function responsing for fetching customersList.
     *
     * @returns The function returns a string message containing successful and errors message.
     */
    const loadEquipmentList = useCallback(async () => {
        if (!housingId) return
        setLoadingEquipmentInProgress(true)
        setIsEquipmentMeterListEmpty(false)
        try {
            const { data: housingEquipments } = await axios.get<IEquipmentMeter[]>(HOUSING_EQUIPMENTS_API(housingId))
            const { data: equipments } = await axios.get<equipmentType[]>(ALL_EQUIPMENTS_API)
            if (!housingEquipments || housingEquipments.length === 0) setIsEquipmentMeterListEmpty(true)
            const responseData = equipments.map((equipment) => {
                const foundEquipment = housingEquipments.find(
                    (housingEquipments) => housingEquipments.equipmentId === equipment.id,
                )
                if (foundEquipment) return foundEquipment
                return {
                    equipmentId: equipment.id,
                    equipmentNumber: 0,
                    equipment,
                }
            })
            setEquipmentList(equipments)
            setHousingEquipmentsList(responseData)
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
    }, [housingId, formatMessage, enqueueSnackbar])
    // UseEffect executes on initial intantiation of useEquipmentList, responsible for loadEquipmentList on initialLoad.
    useEffect(() => {
        if (isInitialMount.current && !equipmentsAccomodationFeatureState) {
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
    // TODO: rename it to addHousingEquipment to avoid confusion.
    const saveEquipment = useCallback(
        async (body: postEquipmentInputType) => {
            if (!housingId) return
            setLoadingEquipmentInProgress(true)
            try {
                const { data: responseData } = await axios.post<
                    postEquipmentInputType,
                    AxiosResponse<postEquipmentInputType>
                >(HOUSING_EQUIPMENTS_API(housingId), body)

                await loadEquipmentList()
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
        },
        [enqueueSnackbar, formatMessage, housingId, loadEquipmentList],
    )

    const addEquipment = useCallback(
        async (data: addEquipmentType) => {
            try {
                setIsAddEquipmentLoading(true)
                const response = await axios.post<addEquipmentType, AxiosResponse<equipmentType>>(
                    `${ALL_EQUIPMENTS_API}`,
                    {
                        ...data,
                        allowedType: ['electrcity'],
                    },
                )

                if (response.status === 201) {
                    await saveEquipment([
                        {
                            equipmentId: data!.id!,
                        },
                    ])
                    enqueueSnackbar(
                        formatMessage({
                            id: "Succès lors de l'ajout de votre équipement",
                            defaultMessage: "Succès lors de l'ajout de votre équipement",
                        }),
                        { variant: 'success' },
                    )
                }
            } catch (error: any) {
                enqueueSnackbar(
                    error.response.data && error.response.data.detail
                        ? formatMessage({
                              id: error.response.data.detail,
                              defaultMessage: error.response.data.detail,
                          })
                        : formatMessage({
                              id: "Erreur lors de l'enregistrement de votre équipments",
                              defaultMessage: "Erreur lors de l'enregistrement de votre équipments",
                          }),
                    { variant: 'error' },
                )
            } finally {
                setIsAddEquipmentLoading(false)
            }
        },
        [enqueueSnackbar, formatMessage, saveEquipment],
    )

    return {
        loadingEquipmentInProgress,
        saveEquipment,
        housingEquipmentsList,
        equipmentList,
        isEquipmentMeterListEmpty,
        loadEquipmentList,
        addEquipment,
        isaAdEquipmentLoading,
    }
}
