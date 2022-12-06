import React, { FC, useEffect } from 'react'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { useIntl } from 'src/common/react-platform-translation'
import TextField from '@mui/material/TextField'
import { cloneDeep, get, isNull, set } from 'lodash'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { IMeterFeatures } from 'src/modules/Meters/Meters'
import { offpeakHoursFieldProps } from 'src/modules/Contracts/contractsTypes.d'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import dayjs from 'dayjs'
import { useHousingMeterDetails } from 'src/modules/Meters/metersHook'
import CircularProgress from '@mui/material/CircularProgress'
import { useParams } from 'react-router-dom'

/**
 * Indicates the key of offpeakHours intervals inside meterFeatures object. This is used purposefully to access offpeakHours, for example to access start hour of first interval in meterFeatures, using get of lodash we'll have get(meterFeatures, "offpeak.offpeakHours.0.start").
 */
const offpeakHoursIntervalsKey = 'offpeak.offpeakHours'

/**
 * Defalt Meter features variable.
 */
const initialMeterFeatures: IMeterFeatures = {
    offpeak: {
        readOnly: false,
        offpeakHours: [
            {
                start: '',
                end: '',
            },
        ],
    },
}

/**
 * Select component wrapped by react-hook-form.
 *
 * @param param0 Diffeent props of material ui select field.
 * @param param0.name The name of the field.
 * @param param0.label The label of the field.
 * @param param0.children The array options of the select.
 * @param param0.validateFunctions  Validators of the field, when required is sent, we add some extra params in the field.
 * @param param0.defaultValue The default value of the field.
 * @param param0.labelProps The props of the InputLabel.
 * @returns Material UI Select field wrapped.
 */
const OffpeakHoursField: FC<offpeakHoursFieldProps> = function ({
    name,
    label,
    children,
    validateFunctions = [],
    labelProps,
    ...otherProps
}) {
    const { houseId } = useParams</**
     *
     */
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        houseId: string
    }>()

    const { control, setValue } = useFormContext()
    const { formatMessage } = useIntl()
    const { elementDetails: housingMeter, loadingInProgress } = useHousingMeterDetails(parseInt(houseId), true)
    const meterFeatures: IMeterFeatures = useWatch({ name, defaultValue: initialMeterFeatures })

    /**
     * Handler when an offpeak hour changes.
     *
     * @param offpeakHourKey Represents the offpeakHour Key in meterFeatures. Which indicates which offpeakHour changes. For example if the change is start hour of first interval, offpeakHourKey will have value "0.start", so that its possible to use lodash and setValue of meterFeatures through this key.
     * @param val New Hour.
     */
    const onOffPeakHourChange = (offpeakHourKey: string, val: Date | null) => {
        const hoursMinutes = val ? dayjs(val).format('HH:mm') : ''
        const newMeterFeatures = cloneDeep(meterFeatures)
        set(newMeterFeatures, `${offpeakHoursIntervalsKey}${offpeakHourKey}`, `${hoursMinutes}`)
        setValue(name, newMeterFeatures)
    }

    /**
     * Add offpeakHourInterval in meterFeatures.
     */
    const addOffPeakHourInterval = () => {
        const newMeterFeatures = cloneDeep(meterFeatures)
        newMeterFeatures.offpeak.offpeakHours.push({
            start: '',
            end: '',
        })
        setValue(name, newMeterFeatures)
    }

    /**
     * Get Value of meter features offpeakHour key in a date format.
     *
     * @param offpeakHourKey Represents the offpeakHour Key in meterFeatures. Which indicates which offpeakHour changes. For example if the change is start hour of first interval, offpeakHourKey will have value "0.start", so that its possible to use lodash and setValue of meterFeatures through this key.
     * @returns Value of offpeakHours in meterFeatures.
     */
    const getOffpeakHourValue = (offpeakHourKey: string) => {
        const offpeakHourValueString = get(meterFeatures, `${offpeakHoursIntervalsKey}${offpeakHourKey}`) as string
        if (!offpeakHourValueString) return null
        const hoursMinutes = offpeakHourValueString.split(':')
        let offpeakHourValue = new Date()
        offpeakHourValue.setHours(parseInt(hoursMinutes[0]))
        offpeakHourValue.setMinutes(parseInt(hoursMinutes[1]))
        return offpeakHourValue
    }

    const startTimePickerLabel = formatMessage({
        id: 'Début',
        defaultMessage: 'Début',
    })

    const endTimePickerLabel = formatMessage({
        id: 'Fin',
        defaultMessage: 'Fin',
    })
    const addOffpeakButtonTitle = formatMessage({
        id: 'Ajouter une plage',
        defaultMessage: 'Ajouter une plage',
    })

    useEffect(() => {
        if (housingMeter && housingMeter.features) setValue(name, housingMeter.features)
    }, [housingMeter, setValue, name])

    if (isNull(housingMeter) && !loadingInProgress) return <></>
    if (loadingInProgress)
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                <CircularProgress size={32} />
            </div>
        )
    return (
        <Controller
            name={name}
            control={control}
            rules={{
                /**
                 * Validation when offpeakHour is not filled from start to end.
                 *
                 * @returns Error message.
                 */
                validate: () => {
                    return meterFeatures.offpeak.offpeakHours.find(
                        (offpeakHour) => !offpeakHour.end || !offpeakHour.start,
                    )
                        ? 'Champ Obligatoire non renseigné'
                        : undefined
                },
            }}
            render={({ field, fieldState }) => (
                <>
                    <TypographyFormatMessage className="my-8 text-13 md:text-16 text-center" {...labelProps}>
                        {label}
                    </TypographyFormatMessage>
                    <FormControl
                        // by default we set fullWidth true because we use it on 80% of our cases
                        fullWidth={true}
                        margin="normal"
                        error={fieldState.invalid}
                        style={{ marginTop: '0' }}
                    >
                        {meterFeatures.offpeak.offpeakHours.map((offpeakHour, index) => (
                            <div
                                style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '12px' }}
                                key={index}
                            >
                                <TimePicker
                                    label={startTimePickerLabel}
                                    value={getOffpeakHourValue(`[${index}].start`) || null}
                                    disabled={meterFeatures.offpeak.readOnly}
                                    onChange={(val) => onOffPeakHourChange(`[${index}].start`, val)}
                                    className="max-w-320 mr-4"
                                    renderInput={(params) => <TextField {...params} required />}
                                />
                                <TimePicker
                                    label={endTimePickerLabel}
                                    value={getOffpeakHourValue(`[${index}].end`) || null}
                                    disabled={meterFeatures.offpeak.readOnly}
                                    onChange={(val) => onOffPeakHourChange(`[${index}].end`, val)}
                                    className="max-w-320 ml-4"
                                    renderInput={(params) => <TextField {...params} required />}
                                />
                            </div>
                        ))}
                        {meterFeatures &&
                            !meterFeatures.offpeak.readOnly &&
                            meterFeatures.offpeak.offpeakHours.length < 2 && (
                                <div className={`flex justify-center`}>
                                    <Tooltip title={addOffpeakButtonTitle}>
                                        <IconButton
                                            className="w-4/5 sm:w-auto"
                                            size="large"
                                            onClick={addOffPeakHourInterval}
                                        >
                                            <AddCircleOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            )}
                        {fieldState.invalid && <FormHelperText>{fieldState.error?.message}</FormHelperText>}
                    </FormControl>
                </>
            )}
        />
    )
}
export default OffpeakHoursField
