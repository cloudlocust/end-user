import { TextField, Typography, Button } from '@mui/material'
import { ResalePriceFormProps } from 'src/modules/MyConsumption/components/ResalePriceForm/ResalePriceForm.type'
import { useIntl } from 'src/common/react-platform-translation'
import { ConsumptionChartHeaderButton } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartHeaderButton'
import { ChangeEvent, useState } from 'react'

/**
 * Form to set the resale price.
 *
 * @param root0 N/A.
 * @param root0.updateResalePriceValue Function to set the resale price value.
 * @param root0.setResaleContractPossessionToFalse Function to set the resale contract possession to false.
 * @param root0.updateResalePriceInProgress Boolean indicating weather the update of the resale price is in progress.
 * @returns ResalePriceForm component.
 */
export const ResalePriceForm = ({
    updateResalePriceValue,
    setResaleContractPossessionToFalse,
    updateResalePriceInProgress,
}: ResalePriceFormProps) => {
    const { formatMessage } = useIntl()
    const [resalePriceInputValue, setResalePriceInputValue] = useState<number | null>(null)

    /**
     * Handle resale tariff input value change.
     *
     * @param event Input change event.
     */
    const handleResaleTariffChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (event.target.value === '' || isNaN(Number(event.target.value))) {
            setResalePriceInputValue(null)
            return
        }
        setResalePriceInputValue(Number(event.target.value))
    }

    /**
     * Handle submit button click.
     */
    const handleSubmitButtonClick = () => {
        if (resalePriceInputValue !== null) {
            updateResalePriceValue(resalePriceInputValue)
        }
    }

    return (
        <div className="rounded-12 p-20" style={{ backgroundColor: '#B5DBDF', color: '#1A6970', maxWidth: '580px' }}>
            <Typography className="font-600">
                {formatMessage({
                    id: 'Pour découvrir les revenus liés à votre surplus, renseignez votre tarif revente',
                    defaultMessage: 'Pour découvrir les revenus liés à votre surplus, renseignez votre tarif revente',
                })}
                &nbsp;:
            </Typography>
            <div className="flex items-baseline flex-wrap gap-7 mt-10">
                <Typography className="inline">
                    {formatMessage({
                        id: 'Mon tarif de revente',
                        defaultMessage: 'Mon tarif de revente',
                    })}
                </Typography>
                <div className="flex items-baseline flex-wrap gap-7">
                    <TextField
                        name="resaleTariff"
                        placeholder="0.0000"
                        variant="filled"
                        className="w-64 hide-number-input-arrows"
                        inputProps={{ type: 'number', className: 'p-7 text-right' }}
                        value={resalePriceInputValue}
                        onChange={handleResaleTariffChange}
                    />
                    <span>€ / kwh</span>
                    <Button
                        variant="contained"
                        className="rounded-4 text-14 py-2 px-0 ml-14"
                        disabled={updateResalePriceInProgress}
                        onClick={handleSubmitButtonClick}
                    >
                        OK
                    </Button>
                </div>
            </div>

            <ConsumptionChartHeaderButton
                text={formatMessage({
                    id: 'Je n’ai pas de contrat de revente',
                    defaultMessage: 'Je n’ai pas de contrat de revente',
                })}
                buttonColor="#F7DDDB"
                textColor="#F44639"
                clickHandler={setResaleContractPossessionToFalse}
                className="mt-10"
                disabled={updateResalePriceInProgress}
            />
        </div>
    )
}
