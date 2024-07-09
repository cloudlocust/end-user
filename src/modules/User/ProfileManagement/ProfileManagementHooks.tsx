import { useIntl } from 'src/common/react-platform-translation'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from 'src/redux'
import { useSnackbar } from 'notistack'
import { isMatch } from 'lodash'
import { IUser } from 'src/modules/User/model'
import { getMsgFromAxiosError } from 'src/modules/utils'
import { useState } from 'react'
import dayjs from 'dayjs'

//eslint-disable-next-line jsdoc/require-jsdoc
export const BACKEND_EMAIL_EXIST_ERROR_MESSAGE = 'UPDATE_USER_EMAIL_ALREADY_EXISTS'
//eslint-disable-next-line jsdoc/require-jsdoc
export const EMAIL_ALREADY_EXIST_SNACKBAR_MESSAGE = "L'email inséré existe déjà"
/**
 * Hook for ProfileManagement.
 *
 * @returns UseProfileManagement.
 */
export const useProfileManagement = () => {
    const dispatch = useDispatch<Dispatch>()
    const [isLoadingInProgress, setIsLoadingInProgress] = useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const { user } = useSelector(({ userModel }: RootState) => userModel)
    /**
     * UpdateProfile function.
     *
     * @param data Data for modification in my profile.
     * @param successUpdateMsg Success update message.
     */
    const updateProfile = async (
        data: IUser & /**Data to change the current user.
         */ {
            /**
             * Password to change.
             */
            password?: string
        },
        successUpdateMsg?: string,
    ) => {
        const dataIsNotModified = isMatch(user as IUser, data)
        if (dataIsNotModified) return
        setIsLoadingInProgress(true)
        try {
            await dispatch.userModel.updateCurrentUser({ data })
            setIsLoadingInProgress(false)
            enqueueSnackbar(
                formatMessage({
                    id: successUpdateMsg || 'Profil modifié avec succès',
                    defaultMessage: successUpdateMsg || 'Profil modifié avec succès',
                }),
                { variant: 'success', autoHideDuration: 8000 },
            )
        } catch (error) {
            setIsLoadingInProgress(false)
            const errorMessage = handleUpdateUserError(error)
            enqueueSnackbar(formatMessage({ id: errorMessage, defaultMessage: errorMessage }), { variant: 'error' })
            throw error
        }
    }

    /**
     * UpdateProfile function.
     *
     * @param password Password.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    const updatePassword = async (password: string) => {
        const formattedBirthdate = dayjs(user?.birthdate).format('DD/MM/YYYY')
        await updateProfile(
            { ...user!, birthdate: user?.birthdate ? formattedBirthdate : undefined, password },
            'Mot de passe modifié avec succès',
        )
    }

    /**
     * DeleteProfile function.
     */
    const deleteProfile = async () => {
        setIsLoadingInProgress(true)
        try {
            await dispatch.userModel.deleteCurrentUser()
            setIsLoadingInProgress(false)
            enqueueSnackbar(
                formatMessage({
                    id: 'Votre profil a été supprimé avec succès',
                    defaultMessage: 'Votre profil a été supprimé avec succès',
                }),
                { variant: 'success', autoHideDuration: 8000 },
            )
        } catch (error) {
            setIsLoadingInProgress(false)
            const errorMessage = handleUpdateUserError(error)
            enqueueSnackbar(formatMessage({ id: errorMessage, defaultMessage: errorMessage }), { variant: 'error' })
            throw error
        }
    }

    return { isLoadingInProgress, updateProfile, updatePassword, deleteProfile }
}
/**
 * Handle message to show in snackbar when update is wrong.
 *
 * @param error Error from Axios.
 * @returns Message.
 */
export const handleUpdateUserError = (error: unknown) => {
    const message = getMsgFromAxiosError(error)
    if (message === BACKEND_EMAIL_EXIST_ERROR_MESSAGE) {
        return EMAIL_ALREADY_EXIST_SNACKBAR_MESSAGE
    }
    return message
}
