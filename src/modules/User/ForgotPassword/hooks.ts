import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Dispatch } from 'src/redux'
import { useSnackbar } from 'notistack'

/**
 * Reset password hook.
 *
 * @returns Login progress state and on submit function.
 */
export const useForgotPassword = () => {
    const dispatch = useDispatch<Dispatch>()
    const [isForgotPasswordProgress, setForgotPasswordProgress] = useState(false)
    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()

    /**
     * Submit forget password data function.
     *
     * @param data N/A.
     * @param data.email Email to use for reset password.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    const onSubmitForgotPassword = async (data: { email: string }) => {
        setForgotPasswordProgress(true)
        try {
            await dispatch.userModel.resetPassword({ data })
            history.replace({ pathname: '/forgot-password-success', state: { email: data.email } })
        } catch (error) {
            setForgotPasswordProgress(false)
            enqueueSnackbar('Une erreur est survenue', { variant: 'error', autoHideDuration: 5000 })
        }
        setForgotPasswordProgress(false)
    }

    return { isForgotPasswordProgress, onSubmitForgotPassword }
}
