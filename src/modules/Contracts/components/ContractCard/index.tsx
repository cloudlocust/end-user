import React from 'react'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { ContractCardProps } from 'src/modules/Contracts/contractsTypes'
import { useConfirm } from 'material-ui-confirm'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import CircularProgress from '@mui/material/CircularProgress'
import { useContractDetails } from 'src/modules/Contracts/contractsHook'

/**
 * Contract Card component.
 *
 * @param props N/A.
 * @param props.contract Contract information object.
 * @param props.onAfterDeleteUpdateSuccess Callback after delete or update success contract.
 * @returns Contract Card component.
 */
const ContractCard = ({ contract, onAfterDeleteUpdateSuccess }: ContractCardProps) => {
    const openMuiDialog = useConfirm()
    const { removeElementDetails: removeContract, loadingInProgress } = useContractDetails(contract.id)

    /**
     * Open warning remove popup on delete click.
     */
    const onDeleteClick = () => {
        openMuiDialog({
            title: '',
            dialogProps: {
                PaperProps: {
                    style: {
                        // MUI snackbar red color, used as a global error color.
                        background: '#D32F2F',
                    },
                },
            },
            description: (
                <TypographyFormatMessage className="text-16 md:text-20 text-center text-white">
                    Vous êtes sur le point de supprimer un contrat. Ëtes-vous sûr de vouloir continuer ?
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
            .then(async () => {
                await removeContract()
                onAfterDeleteUpdateSuccess && onAfterDeleteUpdateSuccess()
            })
            // Catch handles the click on cancel button, giving an empty function it just close the dialog
            .catch(() => {})
    }
    return (
        <Card key={contract.id} className="p-16 overflow-hidden">
            <div className="flex justify-between items-center">
                <Typography className="text-16 font-bold md:text-20">{contract.provider}</Typography>
                <div className="flex items-center">
                    <IconButton color="primary" size="small">
                        <EditIcon />
                    </IconButton>
                    {/* Because material-ui-confirm package close the dialog whether we click on CONFIRM or CANCEL buttons, for user experience showing the spinner in the card when removing contract. */}
                    {loadingInProgress ? (
                        <CircularProgress style={{ color: '#D32F2F', width: '32px', height: '32px' }} />
                    ) : (
                        <IconButton color="error" size="small" onClick={onDeleteClick}>
                            <DeleteIcon />
                        </IconButton>
                    )}
                </div>
            </div>
            <Divider className="my-8" />
            <Typography className="text-13 font-medium md:text-16">
                {contract.offer} - {contract.tariffType} - {contract.power} kVA
            </Typography>
        </Card>
    )
}

export default ContractCard
