import { useState } from 'react'
import { Card, Button } from '@mui/material'
import { useIntl } from 'react-intl'
import TextField from '@mui/material/TextField'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ConsumptionAlertIntervalsType, ConsumptionAlertData } from './consumptionAlert'
import { ConsumptionAlertTitle } from './consumptionAlertsVariables'
import { Form } from 'src/common/react-platform-components'

/**
 * Consumption Alert Component.
 *
 * @param props Props.
 * @param props.interval Interval of the consumption alert.
 * @param props.initialValues Initial value for the text fields.
 * @param props.pricePerKwh Price per kwh.
 * @param props.saveConsumptionAlert Save Consumption alert.
 * @returns Consumption Alert Component.
 */
const ConsumptionAlert = ({
    interval,
    initialValues,
    pricePerKwh,
    saveConsumptionAlert,
}: //eslint-disable-next-line
{
    /**
     * Interval for the consumption alert.
     */
    interval: ConsumptionAlertIntervalsType
    /**
     * Initial value for the text fields.
     */
    initialValues: ConsumptionAlertData | undefined
    /**
     * Price per Kwh.
     */
    pricePerKwh?: number | null
    /**
     * Save consumption alert.
     */
    saveConsumptionAlert: (data: ConsumptionAlertData, interval: ConsumptionAlertIntervalsType) => void
}) => {
    const [isEdit, setIsEdit] = useState(false)
    const [price, setPrice] = useState(initialValues?.price ?? null)
    const [consumption, setConsumption] = useState(initialValues?.consumption ?? null)

    // this state is to keep the fields updated in case we save new data and did not close the drawer
    // tihs will mean that the initial values would be wrong
    const [formValues, setFormValues] = useState<ConsumptionAlertData>({ price, consumption })

    // to keep the last used one, it's the one that will be saved in database
    const [toDeleteBeforeSend, setToDeleteBeforeSend] = useState<'price' | 'consumption' | null>(null)

    /**
     * Handle changes in price textfield.
     *
     * @param priceOnChange Price on the onChange in textField.
     */
    const handlePriceChange = (
        /**
         * Price to convert.
         */
        priceOnChange: number,
    ) => {
        setToDeleteBeforeSend('consumption')

        // NaN is for when the input is empty
        if ([0, NaN].includes(priceOnChange)) {
            setPrice(null)
            setConsumption(NaN)
        } else {
            setPrice(priceOnChange)
            pricePerKwh && setConsumption(priceOnChange / pricePerKwh)
        }
    }

    /**
     * Handle changes in Consumption textfield.
     *
     * @param consumptionOnChange Consumption on the onChange in textField.
     */
    const handleConsumptionChange = (
        /**
         * Price to convert.
         */
        consumptionOnChange: number,
    ) => {
        setToDeleteBeforeSend('price')
        if ([0, NaN].includes(consumptionOnChange)) {
            setConsumption(null)
            setPrice(NaN)
        } else {
            setConsumption(consumptionOnChange)
            pricePerKwh && setPrice(consumptionOnChange * pricePerKwh)
        }
    }

    /**
     * Handle disable form.
     */
    const handleOnDisable = () => {
        setIsEdit(false)
        setPrice(formValues?.price ?? NaN) // Nan is equivalent to empty field.
        setConsumption(formValues?.consumption ?? NaN)
        setToDeleteBeforeSend(null)
    }

    /**
     * Handle On Submit.
     */
    const handleOnSubmit = async () => {
        let finalData: ConsumptionAlertData = {
            consumption,
            price,
        }

        // if the user changed on of them we make to null the second before sending to server (one of them is saved)
        if (toDeleteBeforeSend) {
            finalData[toDeleteBeforeSend] = null
            setToDeleteBeforeSend(null)
            setFormValues({ price, consumption })
            await saveConsumptionAlert(finalData, interval)
        }
        // else we do nothing because the user did not change anything
        setIsEdit(false)
    }

    return (
        <Form onSubmit={() => handleOnSubmit()}>
            <div className="mb-8">
                <Card className="w-full rounded-20 shadow sm:m-4 pb-8" variant="outlined">
                    <div className="flex-col justify-center my-10">
                        <TypographyFormatMessage className="flex justify-center mb-8">
                            {ConsumptionAlertTitle[interval]}
                        </TypographyFormatMessage>
                        <div className="flex justify-around content-center mb-16">
                            <div className="flex justify-center content-center">
                                <TextField
                                    variant="outlined"
                                    name="Consumption"
                                    sx={{ maxWidth: '85px' }}
                                    disabled={!isEdit}
                                    type="number"
                                    value={consumption}
                                    onChange={(value) => handleConsumptionChange(parseFloat(value.target.value))}
                                />
                                <div
                                    className="bg-gray-400 flex items-center justify-center float-left rounded"
                                    style={{ width: 30, height: 51.69, marginLeft: -5, zIndex: 0 }}
                                >
                                    <span>kWh</span>
                                </div>
                            </div>
                            <div className="flex justify-center content-center">
                                <TextField
                                    variant="outlined"
                                    name="price"
                                    sx={{ maxWidth: '85px' }}
                                    disabled={!isEdit}
                                    type="number"
                                    value={price}
                                    onChange={(value) => handlePriceChange(parseFloat(value.target.value))}
                                />
                                <div
                                    className="bg-gray-400 flex items-center justify-center float-left rounded"
                                    style={{ width: 30, height: 51.69, marginLeft: -5, zIndex: 0 }}
                                >
                                    <span>€</span>
                                </div>
                            </div>
                        </div>
                        <ButtonsGroup
                            isEdit={isEdit}
                            enableForm={() => setIsEdit(true)}
                            disableForm={() => handleOnDisable()}
                        />
                    </div>
                </Card>
            </div>
        </Form>
    )
}

/**
 * Group of action buttons.
 *
 * @param props Props.
 * @param props.isEdit Is form in edit mode.
 * @param props.enableForm Change state of edit mode to enable.
 * @param props.disableForm Change state of edit mode to disable.
 * @returns Jsx.
 */
const ButtonsGroup = ({
    isEdit,
    enableForm,
    disableForm,
}: //eslint-disable-next-line
{
    /**
     * Is form editable.
     */
    isEdit: boolean
    /**
     * Function to enable form.
     */
    enableForm: () => void
    /**
     * Function to enable form.
     */
    disableForm: () => void
}) => {
    const { formatMessage } = useIntl()

    return (
        <div className="flex justify-center content-center">
            {isEdit ? (
                <div className="ml-24">
                    <Button variant="outlined" onClick={disableForm}>
                        {formatMessage({
                            id: 'Annuler',
                            defaultMessage: 'Annuler',
                        })}
                    </Button>
                    <Button variant="contained" type="submit" className="ml-8">
                        {formatMessage({
                            id: 'Enregistrer',
                            defaultMessage: 'Enregistrer',
                        })}
                    </Button>
                </div>
            ) : (
                <Button variant="contained" onClick={enableForm}>
                    {formatMessage({
                        id: 'Modifier',
                        defaultMessage: 'Modifier',
                    })}
                </Button>
            )}
        </div>
    )
}

export default ConsumptionAlert
