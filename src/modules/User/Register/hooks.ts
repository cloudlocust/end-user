import { useToggle } from 'react-use'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Dispatch } from 'src/redux'
import { IUserRegister } from '../model'
import { useSnackbar } from 'notistack'
import {
    energyProviderPopupLink,
    isPopupAfterRegistration,
    URL_REGISTER_ENERGY_PROVIDER_SUCCESS,
} from 'src/modules/User/Register/RegisterConfig'
import { USER_REGISTRATION_AUTO_VALIDATE } from 'src/modules/User/configs'
import { convertUserDataToQueryString } from 'src/modules/User/Register/utils'
import { useIntl } from 'src/common/react-platform-translation'

/**
 * Builder to create userRegister hooks. We use a build to easily modify redirect url after register. This function returns a function.
 *
 * @param root0 N/A.
 * @param root0.redirect Redirect function, we use function instead of endpont to handle addition params in the future like role, etc.
 * @returns UseRegister hook.
 */
export const BuilderUseRegister = ({
    redirect,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    /**
     * Redirection function.
     */
    redirect: () => string
}) => {
    /**
     * Hook for registration.
     *
     * @returns UseRegister hook.
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    function useRegister() {
        const dispatch = useDispatch<Dispatch>()
        const [isRegisterInProgress, setIsRegisterInProgress] = useToggle(false)
        const history = useHistory()
        const { enqueueSnackbar } = useSnackbar()
        const { formatMessage } = useIntl()

        /**
         * Function that handles what comes after when user has succesfully registered.
         *
         * @param data User registration data.
         */
        function handleOnAfterSubmit(data: IUserRegister) {
            // TODO - remove this isPopupAfterRegistration because it's for bowatt and it's will probably not be used anymore since we did an alpiq funnel integration.
            if (isPopupAfterRegistration) {
                history.push({
                    pathname: URL_REGISTER_ENERGY_PROVIDER_SUCCESS,
                    state: {
                        energyProviderFormLink: `${energyProviderPopupLink}?${convertUserDataToQueryString(data)}`,
                    },
                })
            } else {
                history.replace(redirect())
            }
        }

        /**
         * Submit function.
         *
         * @param data User registration data from form.
         * @param allowedZipCodes Allowed zipCode for submition.
         */
        const onSubmit = async (data: IUserRegister, allowedZipCodes?: string[]) => {
            if (data.address?.zipCode && allowedZipCodes && !allowedZipCodes?.includes(data.address.zipCode)) {
                enqueueSnackbar(
                    formatMessage({
                        id: "Votre commune de résidence n'est pas éligible à l'offre BôWatts",
                        defaultMessage: "Votre commune de résidence n'est pas éligible à l'offre BôWatts",
                    }),
                    { variant: 'error' },
                )
                return
            }
            setIsRegisterInProgress(true)
            try {
                const { user: userResponse } = await dispatch.userModel.register({ data })
                setIsRegisterInProgress(false)
                if (userResponse) {
                    // If it's energy provider, we don't show the snackbar message.
                    !isPopupAfterRegistration &&
                        enqueueSnackbar(
                            Boolean(USER_REGISTRATION_AUTO_VALIDATE)
                                ? 'Votre inscription a bien été prise en compte. Vous allez reçevoir un lien de confirmation sur votre adresse email.'
                                : "Votre inscription a bien été prise en compte, vous pourrez vous connecter une fois celle-ci validée par l'administrateur.",
                            { variant: 'success', autoHideDuration: 8000 },
                        )
                    handleOnAfterSubmit(data)
                }
            } catch (error) {
                setIsRegisterInProgress(false)
                if (typeof error === 'string') {
                    enqueueSnackbar(error, { variant: 'error' })
                } else {
                    enqueueSnackbar('Une erreur est survenue', { variant: 'error' })
                }
            }
        }

        // Do not let typescript infer otherwise handle submit doesnt understand onsubmit
        // https://fettblog.eu/typescript-react-typeing-custom-hooks/
        return { isRegisterInProgress, onSubmit }
    }
    return useRegister
}

/**
 * Default useRegister hook with redirection to /login after register.
 */
export const useRegister = BuilderUseRegister({
    // eslint-disable-next-line jsdoc/require-jsdoc
    redirect: () => '/login',
})
