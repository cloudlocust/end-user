import { Dialog, DialogContent, Button, Typography } from '@mui/material'
import { useIntl } from 'src/common/react-platform-translation'
import { EnedisDistributorClientDialogProps } from 'src/modules/Onboarding/steps/MeterConnection/components/EnedisDistributorClientDialog/EnedisDistributorClientDialog.types'

/**
 * Component used to check if the user is client of enedis or not.
 *
 * @param root0 EnedisDistributorClientDialog Props.
 * @param root0.isOpening Is dialog opening.
 * @param root0.onCancel Callback to cancel the operation & close the dialog.
 * @param root0.onConfirmationOfUsageOfEnedisDistributor Callback to confirm if the user is client of Enedis.
 * @returns EnedisDistributorClientDialog component.
 */
export const EnedisDistributorClientDialog = ({
    isOpening,
    onCancel,
    onConfirmationOfUsageOfEnedisDistributor,
}: EnedisDistributorClientDialogProps) => {
    const { formatMessage } = useIntl()

    return (
        <Dialog open={isOpening} maxWidth={'sm'}>
            <DialogContent>
                <div className="flex flex-col justify-center align-cente text-center text-sm font-medium my-20">
                    <Typography className="mb-5">
                        {formatMessage({
                            id: "Nous constatons que votre numéro de PDL n'est pas reconnu.",
                            defaultMessage: "Nous constatons que votre numéro de PDL n'est pas reconnu.",
                        })}
                    </Typography>
                    <Typography className="mb-5">
                        {formatMessage({
                            id: 'Pourriez-vous confirmer si votre distributeur est ENEDIS ?',
                            defaultMessage: 'Pourriez-vous confirmer si votre distributeur est ENEDIS ?',
                        })}
                    </Typography>
                </div>
                <div className="flex items-center justify-center flex-col">
                    <div className="flex">
                        <Button
                            variant="contained"
                            className="m-12 min-w-96"
                            onClick={() => onConfirmationOfUsageOfEnedisDistributor(false)}
                        >
                            {formatMessage({
                                id: 'Non',
                                defaultMessage: 'Non',
                            })}
                        </Button>
                        <Button
                            variant="contained"
                            className="m-12 min-w-96"
                            onClick={() => onConfirmationOfUsageOfEnedisDistributor(true)}
                        >
                            {formatMessage({
                                id: 'Oui',
                                defaultMessage: 'Oui',
                            })}
                        </Button>
                    </div>
                    <div className="flex">
                        <Button onClick={onCancel}>
                            {formatMessage({
                                id: 'Utiliser un autre numéro',
                                defaultMessage: 'Utiliser un autre numéro',
                            })}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
