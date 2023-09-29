import IconButton from '@mui/material/IconButton'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { RevokeNrlinkConsentProps } from 'src/modules/MyHouse/components/RevokeNrlinkConsent/RevokeNrlinkConsent'
import { useTheme } from '@mui/material/styles'
import { useConfirm } from 'material-ui-confirm'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useIntl } from 'src/common/react-platform-translation'

/**
 * Revoke NRLink Consent Module.
 *
 * @param root0 N/A.
 * @param root0.nrLinkConsent NRLink consent with all informations needed for BackEnd.
 * @param root0.onAfterRevokeNRLink Callback when nrLink consent is successfully revoked.
 * @returns NRLink Revoke Consent Component.
 */
export const RevokeNrlinkConsent = ({ nrLinkConsent, onAfterRevokeNRLink }: RevokeNrlinkConsentProps) => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const openMuiDialog = useConfirm()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { revokeNrlinkConsent } = useConsents()

    /**
     * Function for revoking NRLink consent.
     */
    const handleRevokeNRLinkConsent = async () => {
        try {
            await openMuiDialog({
                title: '',
                dialogProps: {
                    PaperProps: {
                        style: {
                            background: theme.palette.error.main,
                        },
                    },
                },
                description: (
                    <TypographyFormatMessage className="text-16 md:text-20 text-center text-white">
                        Vous êtes sur le point de révoquer votre consentement nrLINK. Êtes-vous sûr de vouloir continuer
                        ?
                    </TypographyFormatMessage>
                ),
                confirmationText: formatMessage({
                    id: 'Continuer',
                    defaultMessage: 'Continuer',
                }),
                confirmationButtonProps: {
                    className: 'text-13 md:text-16 font-medium text-white',
                },
                cancellationText: formatMessage({
                    id: 'Annuler',
                    defaultMessage: 'Annuler',
                }),
                cancellationButtonProps: {
                    className: 'text-13 md:text-16 font-medium text-white',
                },
            })
            await revokeNrlinkConsent(currentHousing?.id, nrLinkConsent?.nrlinkGuid)
            onAfterRevokeNRLink()
        } catch {}
    }

    return (
        <IconButton color="error" size="small" onClick={handleRevokeNRLinkConsent}>
            <DeleteOutlinedIcon />
        </IconButton>
    )
}
