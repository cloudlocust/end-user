import { useToggle } from 'react-use'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Dispatch } from 'src/redux'
import { useSnackbar } from 'notistack'
import { Link } from '@mui/material'
import { sleep } from '../Register/utils'

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
                history.replace(redirect())
            } catch (error) {
                setLoginInProgress(false)
                if (typeof error === 'string') {
                    if (error === "Votre email n'a pas encore été validé par l'administrateur.") {
                        enqueueSnackbar(
                            <span style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div>Votre email n'a pas encore été validé par l'administrateur.</div>
                                <div>
                                    Si vous avez déjà commencé une inscription sur ALPIQ, finalisez la en cliquant sur
                                    le lien: :{' '}
                                    <Link
                                        color="primary"
                                        onClick={async () => {
                                            window.open('https://particuliers.alpiq.fr/souscription-bowatts', '_blank')
                                            await sleep(3000)
                                        }}
                                        underline="hover"
                                        style={{ cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        Alpiq
                                    </Link>
                                </div>
                            </span>,
                            { variant: 'error', autoHideDuration: 10000 },
                        )
                    } else {
                        enqueueSnackbar(error, { variant: 'error', autoHideDuration: 5000 })
                    }
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
