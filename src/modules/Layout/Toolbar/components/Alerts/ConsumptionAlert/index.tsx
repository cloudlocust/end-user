import { useCallback, useEffect, useRef, useState } from 'react'
import { Card, Button, Divider, Switch } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useIntl } from 'react-intl'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import {
    ConsumptionAlertButtonGroupPropsType,
    ConsumptionAlertData,
    ConsumptionAlertInputFieldsComponentPropsType,
    ConsumptionAlertPropsType,
} from './consumptionAlert'
import { ConsumptionAlertTitle } from './consumptionAlertsVariables'
import { useToggle } from 'react-use'
import { useSnackbar } from 'notistack'
import { Form } from 'src/common/react-platform-components'
import { TextField } from 'src/common/ui-kit'
import { useFormContext } from 'react-hook-form'

/**
 * Consumption Alert Component.
 *
 * @param props Props.
 * @param props.interval Interval of the consumption alert.
 * @param props.initialConsumptionDataValues Initial value for the text fields (consumption and price).
 * @param props.pricePerKwh Price per kwh.
 * @param props.saveConsumptionAlert Save Consumption alert.
 * @param props.isConsumptionAlertsLoading Is consumption alerts loading.
 * @param props.isSavingAlertLoading Is saving alert loading.
 * @param props.isNovuAlertPreferencesLoading Is novu alert preferences loading.
 * @param props.initialAlertPreferencesValues Novu alert Preferences State.
 * @param props.updateNovuAlertPreferences Function that updates novu alerts preferences.
 * @returns Consumption Alert Component.
 */
const ConsumptionAlert = ({
    interval,
    initialConsumptionDataValues,
    pricePerKwh,
    saveConsumptionAlert,
    isConsumptionAlertsLoading,
    isSavingAlertLoading,
    isNovuAlertPreferencesLoading,
    initialAlertPreferencesValues,
    updateNovuAlertPreferences,
}: ConsumptionAlertPropsType) => {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [isEdit, setIsEdit] = useState(false)

    // this state is to keep the fields updated in case we save new data and did not close the drawer
    // tihs will mean that the initial values would be wrong
    const [formValues, setFormValues] = useState<ConsumptionAlertData | undefined>(initialConsumptionDataValues)

    // to keep the last used one, it's the one that will be saved in database
    const [toDeleteBeforeSend, setToDeleteBeforeSend] = useState<'price' | 'consumption' | null>(null)

    const isSwitchSet = useRef(false)
    const [isPush, setIsPush] = useToggle(false)
    const [isEmail, setIsEmail] = useToggle(false)

    useEffect(() => {
        // component render multiple times because of fetchs, we have to handle the initialisation
        setFormValues(initialConsumptionDataValues)
    }, [initialConsumptionDataValues])

    useEffect(() => {
        // for when component is disabled
        !isEdit && setToDeleteBeforeSend(null)
    }, [isEdit])

    useEffect(() => {
        if (!isSwitchSet.current && initialAlertPreferencesValues) {
            setIsPush(initialAlertPreferencesValues.push.value)
            setIsEmail(initialAlertPreferencesValues.email.value)
            isSwitchSet.current = true
        }
    }, [initialAlertPreferencesValues, setIsEmail, setIsPush, isPush])

    /**
     * Reset switch values.
     */
    const resetSwitchValues = () => {
        setIsPush(initialAlertPreferencesValues?.push.value)
        setIsEmail(initialAlertPreferencesValues?.email.value)
    }

    /**
     * Handle submit.
     *
     * @param data Data comming from the form on submit.
     * @returns N/A.
     */
    const handleOnSubmit = async (data: ConsumptionAlertData) => {
        let finalData: ConsumptionAlertData = { consumption: data.consumption, price: data.price }

        // if the user changeduseToggle on of them we make to null the second before sending to server (one of them is saved)
        if (toDeleteBeforeSend) {
            finalData[toDeleteBeforeSend] = null
            setToDeleteBeforeSend(null)
            setFormValues(data)
            await saveConsumptionAlert(finalData, interval)
        }

        // if user changed the switchs we send the modifications
        if (
            isPush !== initialAlertPreferencesValues?.push.value ||
            isEmail !== initialAlertPreferencesValues?.email.value
        ) {
            if (initialAlertPreferencesValues) {
                await updateNovuAlertPreferences(
                    {
                        [initialAlertPreferencesValues.push.key]: isPush,
                        [initialAlertPreferencesValues.email.key]: isEmail,
                    },
                    resetSwitchValues,
                )
            } else {
                // if the initialAlertPreferencesValues is undefined this means either we had an error loading or it did not load yet
                // we put the switchs to default value (false since we have no data)
                setIsPush(false)
                setIsEmail(false)
                // we notify the user that he can't update the notifications
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors de la modification des alertes',
                        defaultMessage: 'Erreur lors de la modification des alertes',
                    }),
                    { variant: 'error', autoHideDuration: 5000 },
                )
            }
        }
        // else we do nothing because the user did not change anything
        setIsEdit(false)
    }

    return (
        <Form onSubmit={handleOnSubmit}>
            <div className="mb-8">
                <Card className="w-full rounded-20 shadow sm:m-4 pb-8" variant="outlined">
                    <div className="flex-col justify-center mt-10">
                        <TypographyFormatMessage className="flex justify-center mb-8 text-13 md:text-16">
                            {ConsumptionAlertTitle[interval]}
                        </TypographyFormatMessage>
                        <ConsumptionAlertsInputFields
                            formValues={formValues}
                            pricePerKwh={pricePerKwh}
                            setToDeleteBeforeSend={setToDeleteBeforeSend}
                            isEdit={isEdit}
                        />
                        <TypographyFormatMessage className="flex ml-8 text-13 md:text-16">
                            Notifications :
                        </TypographyFormatMessage>
                        <div className="flex justify-around content-center">
                            <div className="flex items-center justify-center">
                                <Switch
                                    disabled={!isEdit}
                                    name={initialAlertPreferencesValues?.push.key}
                                    checked={isPush}
                                    onChange={() => setIsPush(!isPush)}
                                    data-testid="pushConsumptionAlert-switch"
                                />
                                <span>Push</span>
                            </div>
                            <div className="flex items-center justify-center">
                                <Switch
                                    disabled={!isEdit}
                                    name={initialAlertPreferencesValues?.email.key}
                                    checked={isEmail}
                                    onChange={() => setIsEmail(!isEmail)}
                                    data-testid="emailConsumptionAlert-switch"
                                />
                                <span>Mail</span>
                            </div>
                        </div>
                        <Divider className="mx-20 mb-12" />
                        <ButtonsGroup
                            isEdit={isEdit}
                            enableForm={() => setIsEdit(true)}
                            disableForm={() => setIsEdit(false)}
                            isConsumptionAlertsLoading={isConsumptionAlertsLoading && isNovuAlertPreferencesLoading}
                            isSavingAlertLoading={isSavingAlertLoading && isNovuAlertPreferencesLoading}
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
}: ConsumptionAlertInputFieldsComponentPropsType) => {
    const { setValue, watch } = useFormContext()

    // reset form values if they change or if form is disabled
    useEffect(() => {
        setValue('price', formValues?.price ?? NaN)
        setValue('consumption', formValues?.consumption ?? NaN)
    }, [setValue, formValues, isEdit])

    /**
     * Handle price on change (typing).
     *
     * @param value Value from input fields.
     */
    const handlePriceChange = useCallback(
        (value: //eslint-disable-next-line
        {
            [x: string]: string
        }) => {
            // if the user is changing the price, we don't send the consumption
            setToDeleteBeforeSend('consumption')

            // NaN is for when the input is empty
            if (value.price && parseFloat(value.price) > 0) {
                setValue('price', parseFloat(parseFloat(value.price).toFixed(2)))
                pricePerKwh && setValue('consumption', parseFloat((parseFloat(value.price) / pricePerKwh).toFixed(2)))
            } else {
                setValue('price', NaN)
                setValue('consumption', NaN)
            }
        },
        [setToDeleteBeforeSend, setValue, pricePerKwh],
    )

    /**
     * Handle Consumption on change (typing).
     *
     * @param value Value from input fields.
     */
    const handleConsumptionChange = useCallback(
        (value: //eslint-disable-next-line
        {
            [x: string]: string
        }) => {
            // if the user is changing the consumption, we don't send the price
            setToDeleteBeforeSend('price')

            if (value.consumption && parseFloat(value.consumption) > 0) {
                setValue('consumption', parseFloat(parseFloat(value.consumption).toFixed(2)))
                pricePerKwh && setValue('price', parseFloat((parseFloat(value.consumption) * pricePerKwh).toFixed(2)))
            } else {
                setValue('consumption', NaN)
                setValue('price', NaN)
            }
        },
        [pricePerKwh, setValue, setToDeleteBeforeSend],
    )

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (type === 'change') {
                if (name === 'price') {
                    handlePriceChange(value)
                }
                if (name === 'consumption') {
                    handleConsumptionChange(value)
                }
            }
        })
        return () => {
            subscription.unsubscribe()
        }
    }, [watch, handleConsumptionChange, handlePriceChange])

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
}: ConsumptionAlertButtonGroupPropsType) => {
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
