import { addEquipmentType, installationInfosType } from './InstallationType.d'
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
    // The list of equipments ids with adding in progress
    const [addingInProgressEquipmentsIds, setAddingInProgressEquipmentsIds] = useState<number[]>([])
    const [isEquipmentMeterListEmpty, setIsEquipmentMeterListEmpty] = useState(false)
    const [equipmentsList, setEquipmentsList] = useState<equipmentType[] | null>(null)
    const [housingEquipmentsList, setHousingEquipmentsList] = useState<IEquipmentMeter[] | null>(null)
    const [isAddEquipmentLoading, setIsAddEquipmentLoading] = useState(false)

    /**
     * Load Customers function responsing for fetching customersList.
     *
     * @returns The function returns a string message containing successful and errors message.
     */
    const loadEquipmentList = useCallback(
        async (isSetLoadingEquipmentInProgress: boolean = true) => {
            if (!housingId) return
            if (isSetLoadingEquipmentInProgress) setLoadingEquipmentInProgress(true)
            setIsEquipmentMeterListEmpty(false)
            try {
                const { data: housingEquipments } = await axios.get<IEquipmentMeter[]>(
                    HOUSING_EQUIPMENTS_API(housingId),
                )
                const { data: equipments } = await axios.get<equipmentType[]>(ALL_EQUIPMENTS_API)
                if (housingEquipments.length === 0) setIsEquipmentMeterListEmpty(true)
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
                setEquipmentsList(equipments)
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
            if (isSetLoadingEquipmentInProgress) setLoadingEquipmentInProgress(false)
        },
        [housingId, formatMessage, enqueueSnackbar],
    )
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
    const addHousingEquipment = useCallback(
        async (body: postEquipmentInputType) => {
            if (!housingId) return

            // get the equipmentIds from the body
            const equipmentIds = body
                .filter((equipment) => equipment.equipmentId)
                .map((equipment) => equipment.equipmentId)

            // Add the new ids to the addingInProgressEquipmentsIds state
            setAddingInProgressEquipmentsIds((addingInProgressEquipmentsIds) => [
                ...addingInProgressEquipmentsIds,
                ...equipmentIds,
            ])

            try {
                const { data: responseData } = await axios.post<
                    postEquipmentInputType,
                    AxiosResponse<postEquipmentInputType>
                >(HOUSING_EQUIPMENTS_API(housingId), body)

                if (responseData) {
                    await loadEquipmentList(false)
                    enqueueSnackbar(
                        formatMessage({
                            id: "Succès lors de l'enregistrement de vos équipments",
                            defaultMessage: "Succès lors de l'enregistrement de vos équipments",
                        }),
                        { variant: 'success' },
                    )
                }

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
            } finally {
                // Remove the equipmentIds from the addingInProgressEquipmentsIds state
                setAddingInProgressEquipmentsIds((addingInProgressEquipmentsIds) =>
                    addingInProgressEquipmentsIds.filter((id) => !equipmentIds.includes(id)),
                )
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
                        id: data.id,
                        name: data.name,
                        allowedType: data.allowedType,
                    },
                )

                // TODO: Remove this because it will be handled in the endpoint
                if (response.status === 201) {
                    const addedHousingEquipment = await addHousingEquipment([
                        {
                            equipmentId: response.data.id,
                        },
                    ])
                    if (addedHousingEquipment && addedHousingEquipment.length > 0) {
                        return addedHousingEquipment
                    }
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
        [enqueueSnackbar, formatMessage, addHousingEquipment],
    )

    return {
        loadingEquipmentInProgress,
        addingInProgressEquipmentsIds,
        addHousingEquipment,
        housingEquipmentsList,
        equipmentsList,
        isEquipmentMeterListEmpty,
        loadEquipmentList,
        addEquipment,
        isAddEquipmentLoading,
    }
}

/**
 * Function to generate the installation API.
 *
 * @param housingId The housing id.
 * @returns The installation API.
 */
export const INSTALLATION_API = (housingId: number) => `${HOUSING_API}/${housingId}/installation`
/**
 * Default error message for getting installations informations.
 */
export const GET_INSTALLATION_DEFAULT_ERROR_MESSAGE = "Erreur lors du chargement de vos informations d'installation"
/**
 * Default error message for adding or updating installations informations.
 */
export const ADD_UPDATE_INSTALLATION_DEFAULT_ERROR_MESSAGE =
    "Erreur lors de l'enregistrement de vos infos d'installation"
/**
 * Success message for adding or updating installations informations.
 */
export const ADD_UPDATE_INSTALLATION_SUCCESS_MESSAGE = "Succès lors de l'enregistrement de vos infos d'installation"

/**
 * Hooks for installation informations.
 *
 * @param housingId The id of the meter.
 * @returns The useInstallation Hook.
 */
export const useInstallation = (housingId?: number) => {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [installationInfos, setInstallationInfos] = useState<installationInfosType | null>(null)
    const [getInstallationInfosInProgress, setGetInstallationInfosInProgress] = useState(false)
    const [addUpdateInstallationInfosInProgress, setAddUpdateInstallationInfosInProgress] = useState(false)

    /**
     * Getting the installation informations for the housing.
     */
    const getInstallationInfos = useCallback(async () => {
        if (!housingId) return
        setGetInstallationInfosInProgress(true)
        try {
            const { data, status } = await axios.get<installationInfosType>(INSTALLATION_API(housingId))
            if (status === 200) {
                setInstallationInfos(data)
            }
        } catch (error: any) {
            enqueueSnackbar(
                formatMessage({
                    id: error?.response?.data?.detail ?? GET_INSTALLATION_DEFAULT_ERROR_MESSAGE,
                    defaultMessage: error?.response?.data?.detail ?? GET_INSTALLATION_DEFAULT_ERROR_MESSAGE,
                }),
                { variant: 'error' },
            )
        } finally {
            setGetInstallationInfosInProgress(false)
        }
    }, [enqueueSnackbar, formatMessage, housingId])

    /**
     * Save installation informations function.
     *
     * @param body Installation informations to save.
     */
    const addUpdateInstallationInfos = useCallback(
        async (body: installationInfosType) => {
            if (!housingId) return
            setAddUpdateInstallationInfosInProgress(true)

            try {
                const { data, status } = await axios.post<installationInfosType, AxiosResponse<installationInfosType>>(
                    INSTALLATION_API(housingId),
                    body,
                )
                if (status === 200) {
                    setInstallationInfos(data)
                    enqueueSnackbar(
                        formatMessage({
                            id: ADD_UPDATE_INSTALLATION_SUCCESS_MESSAGE,
                            defaultMessage: ADD_UPDATE_INSTALLATION_SUCCESS_MESSAGE,
                        }),
                        { variant: 'success' },
                    )
                }
            } catch (error: any) {
                enqueueSnackbar(
                    formatMessage({
                        id: error?.response?.data?.detail ?? ADD_UPDATE_INSTALLATION_DEFAULT_ERROR_MESSAGE,
                        defaultMessage: error?.response?.data?.detail ?? ADD_UPDATE_INSTALLATION_DEFAULT_ERROR_MESSAGE,
                    }),
                    { variant: 'error' },
                )
            } finally {
                setAddUpdateInstallationInfosInProgress(false)
            }
        },
        [enqueueSnackbar, formatMessage, housingId],
    )

    return {
        installationInfos,
        getInstallationInfosInProgress,
        addUpdateInstallationInfosInProgress,
        getInstallationInfos,
        addUpdateInstallationInfos,
    }
}
