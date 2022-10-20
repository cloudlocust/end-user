import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { CheckCircle, Error } from '@mui/icons-material'

/**
 * EnphaseConfirmState component.
 *
 * This component is only used for when the user wants to give his enphase consent.
 *
 * @returns EnphaseConfirmState JSX.
 */
export const EnphaseConfirmState = () => {
    const location = useLocation()
    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()

    // TODO: Put new URLSearchParams and query.get in a custom hook.
    const query = new URLSearchParams(location.search)
    const state = query.get('state')
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const isStateSucess = state?.includes('SUCCESS')
    const isStateError = state?.includes('FAILED')

    /**
     * Function that closes the window with a setTimeout.
     *
     * @param ms Milleseconds.
     * @returns SetTimeout callback.
     */
    const closeWindow = (ms: number = 5000) =>
        setTimeout(() => {
            // * This close the current window.
            window.opener = null
            window.open('', '_self')
            window.close()
        }, ms)

    // * This useEffect is ran when there is no success or fail state
    useEffect(() => {
        if (!isStateSucess && !isStateError) {
            enqueueSnackbar(
                formatMessage({
                    id: 'Une érreur est survenue',
                    defaultMessage: 'Une érreur est survenue',
                }),
                {
                    autoHideDuration: 5000,
                    variant: 'error',
                },
            )
            closeWindow()
        }
    }, [enqueueSnackbar, formatMessage, history, isStateError, isStateSucess])

    // * This useEffect is ran when there is eithher a SUCCESS or FAIL state.
    useEffect(() => {
        if (isStateSucess) {
            setSuccessMessage('Vous avez donné votre consentement Enphase avec succès')
            closeWindow()
        } else if (isStateError) {
            setErrorMessage('La procédure pour donner votre consentement à échoué')
            closeWindow()
        }
    }, [isStateError, isStateSucess, state])

    return (
        <div className="flex items-center justify-center h-screen">
            {successMessage && (
                <div className="flex flex-col items-center">
                    <CheckCircle color="success" className="text-52 mb-12" />
                    <Typography className="text-24">{successMessage}</Typography>
                </div>
            )}
            {errorMessage && (
                <div className="flex flex-col items-center">
                    <Error color="error" className="text-52 mb-12" />
                    <Typography className="text-24">{errorMessage}</Typography>
                </div>
            )}
        </div>
    )
}
