import { useSnackbar } from 'notistack'
import { sleep } from 'src/modules/User/Register/utils'

/**
 * Register to an Energy Provider (Ilek / Alpiq).
 *
 * @returns Function to display Energy Provider subscribe Form.
 */
export const useRegisterToEnergyProvider = () => {
    const { enqueueSnackbar } = useSnackbar()

    /**
     * Display the EnergyProvider subscribe Form to Client.
     *
     * @param energyProviderFormLink Link of the pre-filled Form.
     */
    const displayEnergyProviderSubscribeForm = async (energyProviderFormLink: string) => {
        try {
            const myWindow = window.open(
                energyProviderFormLink,
                '_blank',
                `width=1024,height=768,left=${window.screen.availWidth / 2 - 200},top=${
                    window.screen.availHeight / 2 - 150
                }`,
            )
            await sleep(3000)
            if (!myWindow) throw Error()
        } catch (error) {
            enqueueSnackbar(
                `Nous ne pouvons pas afficher le formulaire d'inscription chez votre fournisseur, veuillez autoriser les Pop-Ups dans les Paramètres du navigateur`,
                { variant: 'error' },
            )
        }
    }

    return { displayEnergyProviderSubscribeForm }
}
