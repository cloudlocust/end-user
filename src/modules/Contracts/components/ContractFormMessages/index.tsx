import { OtherProviderOfferOptionMessageProps } from 'src/modules/Contracts/contractsTypes.d'
import { Typography } from '@mui/material'
import { linksColor } from 'src/modules/utils/muiThemeVariables'
import { useTheme } from '@mui/material/styles'
/**
 * OtherProviderOfferOptionMessage Component.
 *
 * @param props N/A.
 * @param props.isShowMessage Indicates if the message component should be shown.
 * @returns Default Contract Warning message component.
 */
export const OtherProviderOfferOptionMessage = ({ isShowMessage }: OtherProviderOfferOptionMessageProps) => {
    const theme = useTheme()
    if (!isShowMessage) return null
    return (
        <div>
            <Typography className="text-10 md:text-13">
                Veuillez contacter
                <span> </span>
                <a
                    href="mailto:support@myem.fr"
                    className="text-12 md:text-13 underline"
                    style={{
                        color: linksColor || theme.palette.primary.main,
                    }}
                >
                    support@myem.fr
                </a>
                <span> </span>
                en précisant le fournisseur et l’offre que vous souhaitez voir renseignés. Si vous le pouvez, ajoutez la
                grille tarifaire correspondante à votre offre. Cela nous permettra de l'enregistrer plus rapidement.
            </Typography>
        </div>
    )
}
