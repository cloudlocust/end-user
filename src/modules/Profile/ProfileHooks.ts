import { useState } from 'react'
import { API_RESOURCES_URL } from 'src/configs'
import { axios } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { getMsgFromAxiosError } from 'src/modules/utils'
import { AxiosResponse } from 'axios'

//const CUSTOMER_API = 'https://webservice.installerclients.staging.bl.myem.fr'
/**
 * Url for customers (clients webservice) endpoints.
 */
export const PROFILE_API = `${API_RESOURCES_URL}/homeConfiguration`



/**
 * Interests values type.
 */
export type interestValuesType = 'installation' | 'supplier'

/**
 * Represent the model for the customer (firstName, ...etc).
 */
//eslint-disable-next-line jsdoc/require-jsdoc
export type profileT = {
    //eslint-disable-next-line jsdoc/require-jsdoc
    id: number
}

/**
 * Customer address format.
 */
export type customerAddressType =
    //eslint-disable-next-line jsdoc/require-jsdoc
    {
        //eslint-disable-next-line jsdoc/require-jsdoc
        street: string

        //eslint-disable-next-line jsdoc/require-jsdoc
        postalCode: string | null

        //eslint-disable-next-line jsdoc/require-jsdoc
        city: string

        //eslint-disable-next-line jsdoc/require-jsdoc
        country: string

        //eslint-disable-next-line jsdoc/require-jsdoc
        latitude: number

        //eslint-disable-next-line jsdoc/require-jsdoc
        longitude: number

        //eslint-disable-next-line jsdoc/require-jsdoc
        additionalData?: string
    }

export type ProfileDataType = {
    houseType?: string
    houseYear?: string
    residenceType?: string
    energyPerformanceIndex?: string
    numberOfInhabitants?: string
    houseArea?: string
    heating?: string
    hotplates?: string
    'PC de bureau'?: number
    Téléviseur?: number
    Four?: number
    Réfrigérateur?: number
    'Lave linge'?: number
    'PC Portable'?: number
    Aspirateur?: number
    'Micro-onde'?: number
    'Lave-vaisselle'?: number
    'Sèche linge'?: number
    meterId: number
}
/**
`* Hooks for profile.
 *
 * @returns UseCustomersDetails hook.
 */
export function useProfile() {
    const [profile, setProfile] = useState<ProfileDataType>()
    const { enqueueSnackbar } = useSnackbar()
    const [isLoadingInProgress, setIsLoadingInProgress] = useState(false)
    const { formatMessage } = useIntl()

    const updateProfile = async (profile: profileT, body: ProfileDataType) => {
        setIsLoadingInProgress(true)
        try {
            await axios.put<ProfileDataType, AxiosResponse<profileT>>(`${PROFILE_API}/${profile.id}`, body)
            enqueueSnackbar(
                formatMessage({
                    id: 'Vos modifications ont été sauvegardées',
                    defaultMessage: 'Vos modifications ont été sauvegardées',
                }),
                { variant: 'success' },
            )
            setIsLoadingInProgress(false)
        } catch (error) {
            const message = getMsgFromAxiosError(error)
            enqueueSnackbar(message, { variant: 'error' })
            setIsLoadingInProgress(false)
            throw message
        }
    }

    /**
     * Function hook responsible for fetching the function responsible for fetching Profile.
     *
     * @param homeConfigurationId Represent the homeConfigurationId of the profile to be fetched.
     * @returns The function throw an error, and show snackbar message containing successful and errors message.
     */
    const loadProfile = async (homeConfigurationId: number) => {
        setIsLoadingInProgress(true)
        try {
            const { data: responseData } = await axios.get<ProfileDataType>(`${PROFILE_API}/${homeConfigurationId}`)
            setProfile(responseData)
        } catch (error) {
            enqueueSnackbar(
                formatMessage({
                    id: "Home configuration n'existe pas",
                    defaultMessage: "Home configuration n'existe pas",
                }),
                { variant: 'error' },
            )
        }
        setIsLoadingInProgress(false)
    }

    return {
        isLoadingInProgress,
        profile,
        loadProfile,
        updateProfile,
    }
}
