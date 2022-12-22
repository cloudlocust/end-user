import { useEffect, useState } from 'react'
import { Card, Button, Divider } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useIntl } from 'react-intl'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ConsumptionAlertIntervalsType, ConsumptionAlertData } from './consumptionAlert'
import { ConsumptionAlertTitle } from './consumptionAlertsVariables'
import { Form } from 'src/common/react-platform-components'
import { TextField } from 'src/common/ui-kit'
import { useFormContext } from 'react-hook-form'

/**
 * Consumption Alert Component.
 *
 * @param props Props.
 * @param props.interval Interval of the consumption alert.
 * @param props.initialValues Initial value for the text fields.
 * @param props.pricePerKwh Price per kwh.
 * @param props.saveConsumptionAlert Save Consumption alert.
 * @param props.isConsumptionAlertsLoading Is consumption alerts loading.
 * @param props.isSavingAlertLoading Is saving alert loading.
 * @returns Consumption Alert Component.
 */
const ConsumptionAlert = ({
    interval,
    initialValues,
    pricePerKwh,
    saveConsumptionAlert,
    isConsumptionAlertsLoading,
    isSavingAlertLoading,
}: /**
 */
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
    /**
     * Is consumption alerts values loading.
     */
    isConsumptionAlertsLoading: boolean
    /**
     * Is saving alert loading.
     */
    isSavingAlertLoading: boolean
}) => {
    const [isEdit, setIsEdit] = useState(false)

    // this state is to keep the fields updated in case we save new data and did not close the drawer
    // tihs will mean that the initial values would be wrong
    const [formValues, setFormValues] = useState<ConsumptionAlertData | undefined>(initialValues)

    // to keep the last used one, it's the one that will be saved in database
    const [toDeleteBeforeSend, setToDeleteBeforeSend] = useState<'price' | 'consumption' | null>(null)

    useEffect(() => {
        // component render multiple times because of fetchs, we have to handle the initialisation
        setFormValues(initialValues)
    }, [initialValues])

    useEffect(() => {
        // for when component is disabled
        !isEdit && setToDeleteBeforeSend(null)
    }, [isEdit])

    /**
     * Handle submit.
     *
     * @param data Data comming from the form on submit.
     * @returns N/A.
     */
    const handleOnSubmit = async (data: ConsumptionAlertData) => {
        let finalData: ConsumptionAlertData = data

        // if the user changed on of them we make to null the second before sending to server (one of them is saved)
        if (toDeleteBeforeSend) {
            finalData[toDeleteBeforeSend] = null
            setToDeleteBeforeSend(null)
            setFormValues(data)
            await saveConsumptionAlert(finalData, interval)
        }
        // else we do nothing because the user did not change anything
        setIsEdit(false)
    }

    return (
        <Form onSubmit={(data: ConsumptionAlertData) => handleOnSubmit(data)}>
            <div className="mb-8">
                <Card className="w-full rounded-20 shadow sm:m-4 pb-8" variant="outlined">
                    <div className="flex-col justify-center mt-10">
                        <TypographyFormatMessage className="flex justify-center mb-8">
                            {ConsumptionAlertTitle[interval]}
                        </TypographyFormatMessage>
                        <ConsumptionAlertsInputFields
                            formValues={formValues}
                            pricePerKwh={pricePerKwh}
                            setToDeleteBeforeSend={setToDeleteBeforeSend}
                            isEdit={isEdit}
                        />
                        <Divider className="mx-20 mb-12" />
                        <ButtonsGroup
                            isEdit={isEdit}
                            enableForm={() => setIsEdit(true)}
                            disableForm={() => setIsEdit(false)}
                            isConsumptionAlertsLoading={isConsumptionAlertsLoading}
                            isSavingAlertLoading={isSavingAlertLoading}
                        />
                    </div>
                </Card>
            </div>
        </Form>
    )
}

/**
 * Consumption alerts input fields.
 *
 * @param props Props.
 * @param props.isEdit Is Form Edit.
 * @param props.pricePerKwh Price per Kwh.
 * @param props.setToDeleteBeforeSend Function that sets the variable that know which attribute to delete before send to backend.
 * @param props.formValues Variable that keeps form values updated (not to mistake with initial values that loads with components).
 * @returns JSX.
 */
const ConsumptionAlertsInputFields = ({
    isEdit,
    pricePerKwh,
    setToDeleteBeforeSend,
    formValues,
}: /**
 */
{
    /**
     * Is form Edit.
     */
    isEdit: boolean
    /**
     * Price per Kwh.
     */
    pricePerKwh: number | null | undefined
    /**
     * Set to delete Before send.
     */
    setToDeleteBeforeSend: (value: 'price' | 'consumption' | null) => void
    /**
     * Form values that keeps variables updated.
     */
    formValues: ConsumptionAlertData | undefined
}) => {
    const { setValue, watch } = useFormContext()

    const watchPrice = watch('price')
    const watchConsumption = watch('consumption')

    const [typedInput, setTypedInput] = useState<'price' | 'consumption' | null>(null)

    // reset form values if they change or if form is disabled
    useEffect(() => {
        setValue('price', formValues?.price ?? NaN)
        setValue('consumption', formValues?.consumption ?? NaN)
    }, [setValue, formValues, isEdit])

    // watch price changes
    useEffect(() => {
        if (typedInput === 'price') {
            // if the user is changing the price, we don't send the consumption
            setToDeleteBeforeSend('consumption')

            // NaN is for when the input is empty
            if ([0, NaN, null, undefined].includes(watchPrice) || watchPrice < 0) {
                setValue('price', NaN)
                setValue('consumption', NaN)
            } else {
                setValue('price', parseFloat(parseFloat(watchPrice).toFixed(2)))
                pricePerKwh && setValue('consumption', parseFloat((parseFloat(watchPrice) / pricePerKwh).toFixed(2)))
            }
        }
        if (typedInput === 'consumption') {
            // if the user is changing the consumption, we don't send the price
            setToDeleteBeforeSend('price')

            if ([0, NaN, null, undefined].includes(watchConsumption) || watchConsumption < 0) {
                setValue('consumption', NaN)
                setValue('price', NaN)
            } else {
                setValue('consumption', parseFloat(parseFloat(watchConsumption).toFixed(2)))
                pricePerKwh && setValue('price', parseFloat((parseFloat(watchConsumption) * pricePerKwh).toFixed(2)))
            }
        }
    }, [watchPrice, watchConsumption, pricePerKwh, setToDeleteBeforeSend, setValue, typedInput])

    return (
        <div className="flex justify-around content-center mb-16">
            <div className="flex justify-center content-center">
                <TextField
                    name="consumption"
                    style={{ maxWidth: '76px' }}
                    label=""
                    placeholder=""
                    type="number"
                    disabled={!isEdit}
                    variant="outlined"
                    inputProps={{
                        //eslint-disable-next-line
                        onChange: () => setTypedInput('consumption'),
                    }}
                />
                <div
                    className="bg-gray-300 flex items-center justify-center float-left rounded"
                    style={{ width: 40, height: 51.69, marginLeft: -5, zIndex: 0 }}
                >
                    <span>kWh</span>
                </div>
            </div>
            <div className="flex justify-center content-center">
                <TextField
                    name="price"
                    style={{ maxWidth: '76px' }}
                    label=""
                    placeholder=""
                    disabled={!isEdit}
                    type="number"
                    variant="outlined"
                    inputProps={{
                        //eslint-disable-next-line
                        onChange: () => setTypedInput('price'),
                    }}
                />
                <div
                    className="bg-gray-300 flex items-center justify-center float-left rounded"
                    style={{ width: 40, height: 51.69, marginLeft: -5, zIndex: 0 }}
                >
                    <span>€</span>
                </div>
            </div>
        </div>
    )
}

/**
 * Group of action buttons.
 *
 * @param props Props.
 * @param props.isEdit Is form in edit mode.
 * @param props.enableForm Change state of edit mode to enable.
 * @param props.disableForm Change state of edit mode to disable.
 * @param props.isConsumptionAlertsLoading Is button loading.
 * @param props.isSavingAlertLoading Is saving alert loading.
 * @returns Jsx.
 */
const ButtonsGroup = ({
    isEdit,
    enableForm,
    disableForm,
    isConsumptionAlertsLoading,
    isSavingAlertLoading,
}: /**
 */
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
    /**
     * Is button loading.
     */
    isConsumptionAlertsLoading: boolean
    /**
     * Is button loading.
     */
    isSavingAlertLoading: boolean
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
                    <LoadingButton loading={isSavingAlertLoading} type="submit" variant="contained" className="ml-8">
                        {formatMessage({
                            id: 'Enregistrer',
                            defaultMessage: 'Enregistrer',
                        })}
                    </LoadingButton>
                </div>
            ) : (
                <LoadingButton loading={isConsumptionAlertsLoading} variant="contained" onClick={enableForm}>
                    {formatMessage({
                        id: 'Modifier',
                        defaultMessage: 'Modifier',
                    })}
                </LoadingButton>
            )}
        </div>
    )
}

export default ConsumptionAlert
