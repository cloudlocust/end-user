import { Icon, IconButton, Tooltip } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useConfirm } from 'material-ui-confirm'
import { useProfileManagement } from 'src/modules/User/ProfileManagement/ProfileManagementHooks'
import CircularProgress from '@mui/material/CircularProgress'
import { errorMainHashColor } from 'src/modules/utils/muiThemeVariables'

/**
 * Pop-up component "Delete profile" with the ability to delete a profile.
 *
 * @returns Delete profile pop up.
 */
const DeleteProfile = () => {
    const openMuiDialog = useConfirm()
    const { isLoadingInProgress, deleteProfile } = useProfileManagement()

    /**
     * Function that handles on profite delete.
     *
     * It opens a popup.
     */
    const onProfileDelete = async () => {
        await openMuiDialog({
            title: '',
            dialogProps: {
                PaperProps: {
                    sx: {
                        backgroundColor: 'error.main',
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
        // Then handle the click on confirmation button
        await deleteProfile()
    }

    if (isLoadingInProgress) return <CircularProgress size={30} sx={{ color: errorMainHashColor }} />

    return (
        <Tooltip title="Supprimer votre compte">
            <IconButton sx={{ color: errorMainHashColor }} onClick={onProfileDelete} className="mx-12">
                <Icon>delete</Icon>
            </IconButton>
        </Tooltip>
    )
}

export default DeleteProfile
