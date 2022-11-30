import React, { FC, useState } from 'react'
import InputLabel, { InputLabelProps } from '@mui/material/InputLabel'
import FormControl, { FormControlProps } from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { SelectProps } from '@mui/material/Select'
import { CustomValidateResult, validators } from 'src/common/react-platform-components'
import { Controller, useFormContext } from 'react-hook-form'
import find from 'lodash/find'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { useIntl } from 'src/common/react-platform-translation'
import TextField from '@mui/material/TextField'
import { cloneDeep } from 'lodash'
import { Typography } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * Common Ui Select field interface between different ui kits.
 */
export interface SelectFieldProps extends SelectProps {
    /**
     * List of validators.
     */
    validateFunctions?: ((data: any) => CustomValidateResult)[]
    /**
     * Override the default name of material ui to make it required.
     */
    name: string
    /**
     * Override the default label of material ui to make it required.
     */
    label: string
    /**
     * We use inputLabelProps for pass the some props to InputLabel component,
     * and we remove children from the props because we use label of the selelct.
     */
    labelProps?: Omit<Typog, 'children'>
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
const OffPeakHoursField: FC<SelectFieldProps> = function ({
    name,
    label,
    children,
    validateFunctions = [],
    defaultValue = '',
    labelProps,
    ...otherProps
}) {
    const { control, setValue, watch } = useFormContext()
    const { formatMessage } = useIntl()
    const offPeakHours: any = watch(name)

    const onTimePickerChange = (timePickerName: string, val: string | null) => {
        const offPeakHoursClone = cloneDeep(offPeakHours)
        console.log('🚀 ~ file: index.tsx:61 ~ onTimePickerChange ~ timePickerName', timePickerName)
        console.log('🚀 ~ file: index.tsx:59 ~ offPeakHours', offPeakHours)
        offPeakHoursClone[timePickerName] = val
        console.log('🚀 ~ file: index.tsx:65 ~ onTimePickerChange ~ offPeakHoursClone', offPeakHoursClone)
    }
    const startTimePickerLabel = formatMessage({
        id: 'Début',
        defaultMessage: 'Début',
    })

    const endTimePickerLabel = formatMessage({
        id: 'Fin',
        defaultMessage: 'Fin',
    })
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            // @ts-ignore
            // https://github.com/react-hook-form/react-hook-form/pull/5574 waiting for PR.
            rules={{ validate: validators(validateFunctions) }}
            render={({ field, fieldState }) => (
                <>
                    <TypographyFormatMessage className="mb-10 text-13" {...labelProps}>
                        {label}
                    </TypographyFormatMessage>
                    <FormControl
                        // by default we set fullWidth true because we use it on 80% of our cases
                        fullWidth={true}
                        margin="normal"
                        error={fieldState.invalid}
                        required={Boolean(find(validateFunctions, { name: 'required' }))}
                    >
                        <div className="flex justify-center gap-[8px]">
                            <TimePicker
                                label={startTimePickerLabel}
                                value={''}
                                onChange={(val) => onTimePickerChange('0.start', val)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            <TimePicker
                                label={endTimePickerLabel}
                                value={''}
                                onChange={(val) => onTimePickerChange('0.end', val)}
                                renderInput={(params) => <TextField {...params} name="0.end" />}
                            />
                        </div>
                        {fieldState.invalid && <FormHelperText>{fieldState.error?.message}</FormHelperText>}
                    </FormControl>
                </>
            )}
        />
    )
}
export default OffPeakHoursField
