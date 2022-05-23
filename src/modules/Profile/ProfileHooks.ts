import { useState } from 'react'
import { axios } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { getMsgFromAxiosError } from 'src/modules/utils'
import { AxiosResponse } from 'axios'
import { METERS_API } from '../Meters/metersHook'
import { IMeter } from '../Meters/Meters'
import { isMatch } from 'lodash'
//const CUSTOMER_API = 'https://webservice.installerclients.staging.bl.myem.fr'
/**
 * Url for customers (clients webservice) endpoints.
 */
/**
 * Profil url.
 *
 * @param meterId The meterId of the profil.
 * @returns Meters base url.
 */
export const PROFILE_API = (meterId: string) => `${METERS_API}/${meterId}/home-configuration`

export type ProfileDataType = {
    houseType?: string
    houseYear?: string
    residenceType?: string
    energyPerformanceIndex?: string
    isolationLevel?: string
    numberOfInhabitants?: string
    houseArea?: string
    meterId: IMeter
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

    const updateProfile = async (meterId: string, body: ProfileDataType) => {
        const dataIsNotModified = isMatch(profile as ProfileDataType, body)
        console.log(dataIsNotModified)
        // if (dataIsNotModified) return
        setIsLoadingInProgress(true)
        try {
            console.log('meterId', meterId)
            console.log('body', body)
            await axios.post<ProfileDataType, AxiosResponse<any>>(`${PROFILE_API(meterId)}`, body)
            enqueueSnackbar(
                formatMessage({
                    id: 'Vos modifications ont été sauvegardées',
                    defaultMessage: 'Vos modifications ont été sauvegardées',
                }),
                { variant: 'success' },
            )
            setIsLoadingInProgress(false)
        } catch (error) {
            console.log('EROOOr', error)
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
    const loadProfile = async (meterId: string) => {
        setIsLoadingInProgress(true)
        try {
            const { data: responseData } = await axios.get<ProfileDataType>(PROFILE_API(meterId))
            console.log('responseData', responseData, meterId)
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
