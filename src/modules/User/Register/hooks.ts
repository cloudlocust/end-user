import { useToggle } from 'react-use'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Dispatch } from 'src/redux'
import { IUserRegister } from '../model'
import { useSnackbar } from 'notistack'
import { USER_REGISTRATION_AUTO_VALIDATE } from 'src/modules/User/configs'

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
    function useRegister() {
        const dispatch = useDispatch<Dispatch>()
        const [isRegisterInProgress, setIsRegisterInProgress] = useToggle(false)
        const history = useHistory()
        const { enqueueSnackbar } = useSnackbar()

        /**
         * Submit function.
         *
         * @param data TODO Should be detailed.
         */
        const onSubmit = async (data: IUserRegister) => {
            setIsRegisterInProgress(true)
            try {
                await dispatch.userModel.register({ data })
                setIsRegisterInProgress(false)
                history.replace(redirect())
                enqueueSnackbar(
                    Boolean(USER_REGISTRATION_AUTO_VALIDATE)
                        ? 'Votre inscription a bien été prise en compte. Vous allez reçevoir un lien de confirmation sur votre adresse email.'
                        : "Votre inscription a bien été prise en compte, vous pourrez vous connecter une fois celle-ci validée par l'administrateur.",
                    { variant: 'success', autoHideDuration: 8000 },
                )
            } catch (error) {
                // eslint-disable-next-line no-console
                setIsRegisterInProgress(false)
                if (typeof error === 'string') {
                    enqueueSnackbar(error, { variant: 'error' })
                } else {
                    enqueueSnackbar('Une erreur est survenue', { variant: 'error' })
                }
                throw error
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
