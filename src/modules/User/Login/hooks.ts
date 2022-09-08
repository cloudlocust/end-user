import { useToggle } from 'react-use'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Dispatch } from 'src/redux'
import { useSnackbar } from 'notistack'

/**
 * Builder to create userLogin hooks. We use a builder easily modify redirect url after login. This function returns a function.
 *
 * @param root0 N/A.
 * @param root0.redirect Redirect function, we use function instead of endpont to handle addition params in the future like role, etc.
 * @returns UseLogin hook.
 */
export const BuilderUseLogin = ({
    redirect,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    /**
     * Redirection function.
     */
    redirect: () => string
}) => {
    /**
     * Hook for login.
     *
     * @returns UseLogin hook.
     */
    function useLogin() {
        const dispatch = useDispatch<Dispatch>()
        const [isLoginInProgress, setLoginInProgress] = useToggle(false)
        const history = useHistory()
        const { enqueueSnackbar } = useSnackbar()

        /**
         * Submit login function.
         *
         * @param data N/A.
         * @param data.email Email of the user.
         * @param data.password Password of the user.
         */
        // eslint-disable-next-line jsdoc/require-jsdoc
        const onSubmit = async (data: { email: string; password: string }) => {
            setLoginInProgress(true)
            try {
                await dispatch.userModel.login({ data })
                await dispatch.housingModel.loadHousingsList()
                history.replace(redirect())
            } catch (error) {
                setLoginInProgress(false)
                if (typeof error === 'string') {
                    enqueueSnackbar(error, { variant: 'error', autoHideDuration: 5000 })
                } else {
                    enqueueSnackbar('Une erreur est survenue', { variant: 'error', autoHideDuration: 5000 })
                }
                throw error
            }
            setLoginInProgress(false)
        }

        // Do not let typescript infer otherwise handle submit doesnt understand onsubmit
        // https://fettblog.eu/typescript-react-typeing-custom-hooks/
        return { isLoginInProgress, onSubmit }
    }
    return useLogin
}

/**
 *
 */
export const useLogin = BuilderUseLogin({
    // eslint-disable-next-line jsdoc/require-jsdoc
    redirect: () => '/user',
})
