import React from 'react'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { IContract } from 'src/modules/Contracts/contractsTypes'
import { useTheme } from '@mui/material'
import { useConfirm } from 'material-ui-confirm'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * Contract Card component.
 *
 * @param props N/A.
 * @param props.contract Contract information object.
 * @returns Contract Card component.
 */
const ContractCard = ({
    contract,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    contract: IContract
}) => {
    const openMuiDialog = useConfirm()
    const theme = useTheme()

    /**
     * Open warning remove popup on delete click.
     */
    const onDeleteClick = () => {
        openMuiDialog({
            title: '',
            dialogProps: {
                PaperProps: {
                    style: {
                        background: theme.palette.error.main,
                    },
                },
            },
            description: (
                <TypographyFormatMessage
                    className="text-16 md:text-20 text-center"
                    style={{ color: theme.palette.error.contrastText }}
                >
                    Vous êtes sur le point de supprimer un contrat. Ëtes-vous sûr de vouloir continuer ?
                </TypographyFormatMessage>
            ),
            confirmationText: (
                <TypographyFormatMessage
                    className="text-13 md:text-16 font-medium"
                    style={{ color: theme.palette.error.contrastText }}
                >
                    Continuer
                </TypographyFormatMessage>
            ),
            cancellationText: (
                <TypographyFormatMessage
                    className="text-13 md:text-16 font-medium"
                    style={{ color: theme.palette.error.contrastText }}
                >
                    Annuler
                </TypographyFormatMessage>
            ),
        })
            // Then handle the click on confirmation button
            .then(() => {})
            // Catch handles the click on cancel button, giving an empty function it just close the dialog
            .catch(() => {})
    }
    return (
        <Card key={contract.guid} className="p-16 overflow-hidden">
            <div className="flex justify-between items-center">
                <Typography className="text-16 font-bold md:text-20">{contract.provider}</Typography>
                <div>
                    <IconButton color="primary" size="small">
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={onDeleteClick}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            </div>
            <Divider className="my-8" />
            <Typography className="text-13 font-medium md:text-16">
                {contract.offer} - {contract.type} - {contract.power}
            </Typography>
        </Card>
    )
}

export default ContractCard
