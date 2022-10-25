import React, { useState } from 'react'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { ContractCardProps, contractsRouteParam } from 'src/modules/Contracts/contractsTypes'
import { useConfirm } from 'material-ui-confirm'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import CircularProgress from '@mui/material/CircularProgress'
import { useContractDetails } from 'src/modules/Contracts/contractsHook'
import { useParams } from 'react-router-dom'
import Dialog from '@mui/material/Dialog'
import { addContractDataType } from 'src/modules/Contracts/contractsTypes.d'
import ContractForm from 'src/modules/Contracts/components/ContractForm'
import dayjs from 'dayjs'
import { useIntl } from 'react-intl'

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
    // HouseId extracted from params of the url :houseId/contracts
    const { houseId } = useParams<contractsRouteParam>()
    const {
        removeElementDetails: removeContract,
        loadingInProgress: isContractsLoading,
        editElementDetails,
    } = useContractDetails(parseInt(houseId), contract.id)
    const [isContractFormOpen, setIsContractFormOpen] = useState(false)
    const { formatMessage } = useIntl()

    /**
     * Open warning remove popup on delete click.
     */
    const onDeleteClick = async () => {
        await openMuiDialog({
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
        await removeContract()
        onAfterDeleteUpdateSuccess && onAfterDeleteUpdateSuccess()
        // Catch handles the click on cancel button, But no need for a catch as it closes the dialog no matter what
    }
    return (
        <>
            <Dialog
                open={isContractFormOpen}
                fullWidth={true}
                maxWidth="sm"
                onClose={() => setIsContractFormOpen(false)}
            >
                <ContractForm
                    onSubmit={async (input: addContractDataType) => {
                        await editElementDetails(input)
                        onAfterDeleteUpdateSuccess && onAfterDeleteUpdateSuccess()
                        setIsContractFormOpen(false)
                    }}
                    isContractsLoading={isContractsLoading}
                    defaultValues={{
                        contractTypeId: contract.contractType.id,
                        offerId: contract.offer.id,
                        power: contract.power,
                        providerId: contract.provider.id,
                        startSubscription: contract.startSubscription,
                        endSubscription: contract.endSubscription,
                        tariffTypeId: contract.tariffType.id,
                    }}
                />
            </Dialog>
            <Card key={contract.id} className="p-16 overflow-hidden h-full contract-card">
                <div className="flex justify-between items-center">
                    <Typography className="text-16 font-bold md:text-20">{contract.provider.name}</Typography>{' '}
                    <Typography className="text-12 font-light">
                        {dayjs(contract.startSubscription).format('DD/MM/YYYY')} -{' '}
                        {contract.endSubscription
                            ? dayjs(contract.startSubscription).format('DD/MM/YYYY')
                            : formatMessage({ id: 'En cours', defaultMessage: 'En cours' })}
                    </Typography>
                    <div className="flex items-center">
                        <IconButton
                            color="primary"
                            size="small"
                            onClick={() => {
                                setIsContractFormOpen(true)
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                        {/* Because material-ui-confirm package close the dialog whether we click on CONFIRM or CANCEL buttons, for user experience showing the spinner in the card when removing contract. */}
                        {isContractsLoading ? (
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
                    {contract.offer.name} - {contract.tariffType.name} - {contract.power} kVA
                </Typography>
            </Card>
        </>
    )
}

export default ContractCard
