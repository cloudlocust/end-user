import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Dispatch } from 'src/redux'
import { useSnackbar } from 'notistack'

/**
 * Reset password hook.
 *
 * @returns Reset password progress state and on submit function.
 */
export const useResetPassword = () => {
    const dispatch = useDispatch<Dispatch>()
    const [isResetPasswordProgress, setResetPasswordProgress] = useState(false)
    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()

    /**
     * Submit new password with token function.
     *
     * @param data N/A.
     * @param data.password New provided password.
     * @param data.token Token retrieved from URL params.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    const onSubmitResetPassword = async (data: { password: string; token: string }) => {
        setResetPasswordProgress(true)
        try {
            await dispatch.userModel.changePassword({ data })
            enqueueSnackbar('Votre mot de passe a bien été changé', { variant: 'success', autoHideDuration: 8000 })
            // Wait 5 seconds before redirection to /login
            setTimeout(() => history.push('/login'), 5000)
        } catch (error) {
            setResetPasswordProgress(false)
            enqueueSnackbar('Une erreur est survenue', { variant: 'error', autoHideDuration: 5000 })
        }
        setResetPasswordProgress(false)
    }

    return { isResetPasswordProgress, onSubmitResetPassword }
}
