import React, { FC, useEffect, useMemo } from 'react'
import DatePickerUI, { DatePickerProps } from '@mui/lab/DatePicker'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import { Controller, useFormContext } from 'react-hook-form'
import { CustomValidateResult, validators } from 'src/common/react-platform-components'
import {
    minDate as minDateValidator,
    maxDate as maxDateValidator,
} from 'src/common/react-platform-components/form-validators'
import dayjs from 'dayjs'

/**
 * Common Ui text field interface between different ui kits. We pick common text field from basic ui kit, and add validatefunctions
 * We also override the name to make it required.
 */
export interface DatePickerFieldProps extends Partial<DatePickerProps> {
    /**
     * List of validators.
     */
    validateFunctions?: ((data: any) => CustomValidateResult)[]
    /**
     * Override the default name of material ui to make it required.
     */
    name: string
    /**
     * The format of the date will be obtain on the value by default is YYY-MM-DD.
     */
    valueFormat?: string
    /**
     * Override the default maxDate of material ui to make it string because we use dayjs for pase it.
     */
    maxDate?: string
    /**
     * Override the default minDate of material ui to make it string we use dayjs for pase it.
     */
    minDate?: string
    /**
     * We use it for pass the some props to TextField, and we remove some props because it passed by default by DatePickerProps.
     */
    textFieldProps?: Omit<
        TextFieldProps,
        'name' | 'value' | 'onChange' | 'disabled' | 'inputRef' | 'select' | 'SelectProps' | 'label'
    >
}

/**
 * Date picker component wrapped by react-hook-form https://mui.com/components/date-picker/.
 *
 * @see https://next.material-ui-pickers.dev/guides/forms
 * @param root0 Diffeent props of material ui text field.
 * @param root0.name The name of the field.
 * @param root0.validateFunctions Validators of the field, when required is sent, we add some extra params in the field.
 * @param root0.maxDate Minimum date with YYYY-MM-DD format.
 * @param root0.minDate Maximum date with YYYY-MM-DD format.
 * @param root0.textFieldProps The props of the TextField.
 * @param root0.valueFormat Returned date format, by default YYYY-MM-DD.
 * @returns Material UI datepicker field wrapped.
 */
export const DatePicker: FC<DatePickerFieldProps> = function ({
    name,
    validateFunctions = [],
    valueFormat = 'YYYY-MM-DD',
    maxDate: maxDateStringValue = '2099-12-31',
    minDate: minDateStringValue = '1900-01-01',
    textFieldProps,
    ...otherProps
}) {
    useEffect(() => {
        // Validate the minDate
        if (!dayjs(minDateStringValue, valueFormat).isValid()) {
            throw new Error(`Invalide minDate format, please use ${valueFormat}`)
        }

        // Validate the maxDate
        if (!dayjs(maxDateStringValue, valueFormat).isValid()) {
            throw new Error(`Invalide maxDate format, please use ${valueFormat}`)
        }
    }, [maxDateStringValue, minDateStringValue, valueFormat])

    // parse the minDate
    const minDate = useMemo(() => dayjs(minDateStringValue, valueFormat), [minDateStringValue, valueFormat])
    // parse the maxDate
    const maxDate = useMemo(() => dayjs(maxDateStringValue, valueFormat), [maxDateStringValue, valueFormat])

    // We muse use form provider in upper form to be able to have a context
    const { control, setValue } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                // @ts-ignore
                // https://github.com/react-hook-form/react-hook-form/pull/5574 waiting for PR.
                validate: validators([
                    ...validateFunctions,
                    minDateValidator(minDateStringValue),
                    maxDateValidator(maxDateStringValue),
                ]),
            }}
            render={({ field, fieldState }) => (
                <DatePickerUI
                    minDate={minDate}
                    maxDate={maxDate}
                    renderInput={(params) => (
                        <TextField
                            // by default we set fullWidth true because we use it on 80% of our cases
                            fullWidth={true}
                            margin="normal"
                            {...params}
                            error={fieldState.invalid}
                            helperText={fieldState.invalid ? fieldState.error?.message : ''}
                            onBlur={field.onBlur}
                            {...textFieldProps}
                        />
                    )}
                    {...otherProps}
                    {...field}
                    // note: you must not use undefined because it display current date
                    value={field.value || null}
                    onChange={(date) => {
                        if (date.isValid()) {
                            setValue(name, date.format(valueFormat), { shouldValidate: true })
                        } else {
                            setValue(name, date, { shouldValidate: true })
                        }
                    }}
                />
            )}
        />
    )
}
