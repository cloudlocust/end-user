import { Card, Typography } from '@mui/material'
import { ButtonLoader } from 'src/common/ui-kit'
import { useIntl } from 'src/common/react-platform-translation'
import { Step } from 'src/modules/Onboarding/components/Step'
import ContractForm from 'src/modules/Contracts/components/ContractForm'
import { addContractDataType } from 'src/modules/Contracts/contractsTypes'
import { useContractList } from 'src/modules/Contracts/contractsHook'
import { useState } from 'react'
import { ContractStepProps } from 'src/modules/Onboarding/steps/ContractStep/ContractStep.types'

/**
 * Contract step in nrLink connection.
 *
 * @param root0 Props.
 * @param root0.onNext Callback on next step.
 * @param root0.housingId Housing id.
 * @returns JSX Element.
 */
export const ContractStep = ({ onNext, housingId }: ContractStepProps) => {
    const { loadingInProgress: isContractsLoading, addElement: addContract } = useContractList(housingId!)
    const [isContractAdding, setIsContractAdding] = useState(false)
    const { formatMessage } = useIntl()

    /**
     * Handle Submit form.
     *
     * @param data Data of the form.
     */
    const handleSubmit = async (data: addContractDataType) => {
        setIsContractAdding(true)
        try {
            await addContract(data)
            onNext()
            // Catching the error to avoir application crash and stops working.
        } catch (error) {
        } finally {
            setIsContractAdding(false)
        }
    }

    return (
        <Step
            title={formatMessage(
                {
                    id: '{step}/{totalStep}: L’électricité... c’est de l’argent !',
                    defaultMessage: '{step}/{totalStep}: L’électricité... c’est de l’argent !',
                },
                { step: 4, totalStep: 4 },
            )}
            content={
                <>
                    <Typography variant="subtitle1" className="mt-24 self-start" sx={{ color: 'primary.main' }}>
                        {formatMessage({
                            id: 'Pour afficher votre consommation en € choisissez votre contrat :',
                            defaultMessage: 'Pour afficher votre consommation en € choisissez votre contrat :',
                        })}
                    </Typography>
                    <Typography variant="subtitle2" className="mt-5" sx={{ color: 'grey.500' }}>
                        {formatMessage({
                            id: 'Toutes les informations nécessaires sont disponibles sur votre facture ou votre contrat d’électricité.',
                            defaultMessage:
                                'Toutes les informations nécessaires sont disponibles sur votre facture ou votre contrat d’électricité.',
                        })}
                    </Typography>

                    <Card className="w-full mt-10 bg-white rounded-8 min-h-320" elevation={0}>
                        <ContractForm
                            onSubmit={handleSubmit}
                            isContractsLoading={isContractsLoading}
                            isFormDescriptionsVisible={false}
                            isUsingRemoteSubmit={true}
                        />
                    </Card>

                    <div style={{ marginTop: 10, alignSelf: 'flex-end' }}>
                        <ButtonLoader
                            variant="contained"
                            className="w-128 rounded-8"
                            disableElevation={true}
                            disableRipple={true}
                            type="submit"
                            form="contract-form"
                            inProgress={isContractAdding || isContractsLoading}
                        >
                            {formatMessage({ id: 'Suivant', defaultMessage: 'Suivant' })}
                        </ButtonLoader>
                    </div>
                    {/* todo: to use for later when the functionality will be ready */}
                    {/* <Button
                        variant="contained"
                        className="self-start text-left"
                        style={{ marginTop: 10, borderRadius: 4, background: theme.palette.grey['500'] }}
                        disableElevation={true}
                        disableRipple={true}
                    >
                        {formatMessage({
                            id: 'Mon contrat n’est pas dans la liste',
                            defaultMessage: 'Mon contrat n’est pas dans la liste',
                        })}
                    </Button> */}
                </>
            }
        />
    )
}
