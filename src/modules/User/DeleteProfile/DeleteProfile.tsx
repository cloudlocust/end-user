import { Icon, IconButton, Tooltip } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useConfirm } from 'material-ui-confirm'
import { useTheme } from '@mui/material/styles'

/**
 * Pop-up component "Delete profile" with the ability to delete a profile.
 *
 * @returns Delete profile pop up.
 */
const DeleteProfile = () => {
    const confirm = useConfirm()
    const theme = useTheme()

    /**
     * Function that handles on profite delete.
     *
     * It opens a popup.
     */
    const onProfileDelete = async () => {
        await confirm({
            title: '',
            dialogProps: {
                PaperProps: {
                    style: {
                        background: theme.palette.error.main,
                    },
                },
            },
            description: (
                <TypographyFormatMessage className="text-16 md:text-18 text-center text-white">
                    Vous êtes sur le point de supprimer votre compte utilisateur. Attention, toutes les données
                    relatives à votre compte seront supprimées. Êtes-vous sûr de vouloir continuer ?
                </TypographyFormatMessage>
            ),
            confirmationText: (
                <TypographyFormatMessage className="text-13 md:text-16 font-medium text-white">
                    Continuer
                </TypographyFormatMessage>
            ),
            cancellationText: (
                <TypographyFormatMessage className="text-13 md:text-16 font-medium text-white">
                    Annuler
                </TypographyFormatMessage>
            ),
        })
    }

    return (
        <Tooltip title="Supprimer votre compte">
            <IconButton
                color="error"
                onClick={onProfileDelete}
                className="mx-12"
                sx={{ outlined: theme.palette.secondary.main }}
            >
                <Icon>delete</Icon>
            </IconButton>
        </Tooltip>
    )
}

export default DeleteProfile
