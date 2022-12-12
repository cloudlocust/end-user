import { useState } from 'react'
import { Card, Button } from '@mui/material'
import { useIntl } from 'react-intl'
import TextField from '@mui/material/TextField'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ConsumptionAlertIntervalsType } from 'src/modules/Layout/Toolbar/components/Alerts/ConsumptionAlert/consumptionAlert'

/**
 * Consumption Alert Component.
 *
 * @param props Props.
 * @param props.interval Interval of the consumption alert.
 * @returns Consumption Alert Component.
 */
const ConsumptionAlert = ({
    interval,
}: //eslint-disable-next-line
{ interval: ConsumptionAlertIntervalsType
}) => {
    /**
     * Constant to have titles for each interval for the consumptions.
     */
    const ConsumptionAlertTitle = {
        day: "Seuil d'alerte journalier",
        week: "Seuil d'alerte hebdomadaire",
        month: "Seuil d'alerte mensuel",
    }

    const [isEdit, setIsEdit] = useState(false)

    return (
        <div className="mb-8">
            <Card className="w-full rounded-20 shadow sm:m-4 pb-8" variant="outlined">
                <div className="flex-col justify-center my-10">
                    <TypographyFormatMessage className="flex justify-center mb-8">
                        {ConsumptionAlertTitle[interval]}
                    </TypographyFormatMessage>
                    <div className="flex justify-around content-center mb-16">
                        <CustomTextFieldInput endSymbol="kWh" disabled={!isEdit} />
                        <CustomTextFieldInput endSymbol="€" disabled={!isEdit} />
                    </div>
                    <ButtonsGroup
                        isEdit={isEdit}
                        enableForm={() => setIsEdit(true)}
                        disableForm={() => setIsEdit(false)}
                    />
                </div>
            </Card>
        </div>
    )
}

/**
 * Component for input field € and kWh.
 *
 * @param props N/A.
 * @param props.endSymbol Is the input a consumption or price.
 * @param props.disabled Is the field disabled.
 * @returns JSX.
 */
const CustomTextFieldInput = ({
    endSymbol,
    disabled,
}: //eslint-disable-next-line
{
    /**
     * Text Field Input Type.
     */
    endSymbol: String
    /**
     * If field is Disabled.
     */
    disabled: boolean
}) => {
    return (
        <div className="flex justify-center content-center">
            <TextField
                variant="outlined"
                sx={{ maxWidth: '75px' }}
                disabled={disabled}
                type="number"
                defaultValue={0}
            />
            <div
                className="bg-gray-400 flex items-center justify-center float-left rounded"
                style={{ width: 30, height: 51.69, marginLeft: -5, zIndex: 0 }}
            >
                <span>{endSymbol}</span>
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
                    {/* Button to change to ButtonResetForm and ButtonLoader in next PR after adding form */}
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
