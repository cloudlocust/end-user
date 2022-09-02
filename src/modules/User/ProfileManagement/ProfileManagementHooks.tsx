import { useIntl } from 'src/common/react-platform-translation'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from 'src/redux'
import { useSnackbar } from 'notistack'
import { isMatch } from 'lodash'
import { IUser } from 'src/modules/User/model'
import { getMsgFromAxiosError } from 'src/modules/utils'
import { useState } from 'react'

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
    const [isModifyInProgress, setIsModifyInProgress] = useState(false)
    const [isChangePasswordInProgress, setIsChangePasswordInProgress] = useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const { user } = useSelector(({ userModel }: RootState) => userModel)
    /**
     * UpdateProfile function.
     *
     * @param data Data for modification in my profile.
     */
    const updateProfile = async (data: IUser) => {
        const dataIsNotModified = isMatch(user as IUser, data)
        if (dataIsNotModified) return
        setIsModifyInProgress(true)
        try {
            await dispatch.userModel.updateCurrentUser({ data })
            setIsModifyInProgress(false)
            enqueueSnackbar(
                formatMessage({
                    id: 'Profil modifié avec succès',
                    defaultMessage: 'Profil modifié avec succès',
                }),
                { variant: 'success', autoHideDuration: 8000 },
            )
        } catch (error) {
            setIsModifyInProgress(false)
            const errorMessage = handleUpdateUserError(error)
            enqueueSnackbar(formatMessage({ id: errorMessage, defaultMessage: errorMessage }), { variant: 'error' })
            throw error
        }
    }
    /**
     * UpdateProfile function.
     *
     * @param data Data for modification in my profile.
     */
    const updatePassword = async (data: IUser) => {
        const dataIsNotModified = isMatch(user as IUser, data)
        if (dataIsNotModified) return
        setIsChangePasswordInProgress(true)
        try {
            await dispatch.userModel.updateCurrentUser({ data })
            setIsChangePasswordInProgress(false)
            enqueueSnackbar(
                formatMessage({
                    id: 'Mot de passe modifié avec succès',
                    defaultMessage: 'Mot de passe modifié avec succès',
                }),
                { variant: 'success', autoHideDuration: 8000 },
            )
        } catch (error) {
            setIsChangePasswordInProgress(false)
            const errorMessage = handleUpdateUserError(error)
            enqueueSnackbar(formatMessage({ id: errorMessage, defaultMessage: errorMessage }), { variant: 'error' })
            throw error
        }
    }

    return { isModifyInProgress, updateProfile, isChangePasswordInProgress, updatePassword }
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
