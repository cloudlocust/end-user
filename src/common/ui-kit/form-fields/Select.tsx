import { FC } from 'react'
import InputLabel, { InputLabelProps } from '@mui/material/InputLabel'
import FormControl, { FormControlProps } from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import SelectUI, { SelectProps } from '@mui/material/Select'
import { CustomValidateResult, validators } from 'src/common/react-platform-components'
import { Controller, useFormContext } from 'react-hook-form'
import find from 'lodash/find'

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
     * We use formControlProps for pass the some props to FormControl component,
     * and we remove required because we take it from requiredBuilder validator.
     */
    formControlProps?: Omit<FormControlProps, 'required'>
    /**
     * We use inputLabelProps for pass the some props to InputLabel component,
     * and we remove children from the props because we use label of the selelct.
     */
    inputLabelProps?: Omit<InputLabelProps, 'children'>
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
 * @param param0.formControlProps The props of the FormControl.
 * @param param0.inputLabelProps The props of the InputLabel.
 * @returns Material UI Select field wrapped.
 */
export const Select: FC<SelectFieldProps> = function ({
    name,
    label,
    children,
    validateFunctions = [],
    defaultValue = '',
    formControlProps,
    inputLabelProps,
    ...otherProps
}) {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            // @ts-ignore
            // https://github.com/react-hook-form/react-hook-form/pull/5574 waiting for PR.
            rules={{ validate: validators(validateFunctions) }}
            render={({ field, fieldState }) => (
                <FormControl
                    // by default we set fullWidth true because we use it on 80% of our cases
                    fullWidth={true}
                    margin="normal"
                    error={fieldState.invalid}
                    {...formControlProps}
                    required={Boolean(find(validateFunctions, { name: 'required' }))}
                >
                    <InputLabel id={`${name}-label`} {...inputLabelProps}>
                        {label}
                    </InputLabel>
                    <SelectUI labelId={`${name}-label`} id={name} displayEmpty label={label} {...field} {...otherProps}>
                        {children}
                    </SelectUI>
                    {fieldState.invalid && <FormHelperText>{fieldState.error?.message}</FormHelperText>}
                </FormControl>
            )}
        />
    )
}
