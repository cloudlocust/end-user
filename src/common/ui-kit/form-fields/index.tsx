import _ from 'lodash'
import {
    TextField as MaterialUiNativeTextField,
    Checkbox as CheckboxUI,
    FormControl,
    FormControlLabel,
    FormControlLabelProps,
    FormControlProps,
    FormHelperText,
} from '@mui/material'
import { CustomValidateResult, FieldValidate, validators } from 'src/common/react-platform-components'
import React, { ChangeEvent, FC, useState, useMemo } from 'react'
import { RegisterOptions, useFormContext } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { TextFieldProps as MaterialUiTextFieldProps } from '@mui/material/TextField'
import { Icon, IconButton, InputAdornment } from '@mui/material'
import { textFieldCommonTypes } from 'src/common/react-platform-components/ui-kit-interface'

/**
 * Common Ui text field interface between different ui kits. We pick common text field from basic ui kit, and add validatefunctions
 * We also override the name to make it required.
 */
export interface UiTextFieldProps extends Pick<MaterialUiTextFieldProps, textFieldCommonTypes> {
    /**
     * List of validators.
     */
    validateFunctions?: ((data: any) => CustomValidateResult)[]
    /**
     * Override the default name of material ui to make it required.
     */
    name: string
}

/**
 * A wrapper for text field from material ui. It must be placed with an upper from context from form hooks.
 *
 * @param root0 Diffeent props of material ui text field.
 * @param root0.name The name of the field.
 * @param root0.validateFunctions Validators of the field, when required is sent, we add some extra params in the field.
 * @returns Material UI text field wrapped.
 */
export const MuiTextField: FC<UiTextFieldProps & MaterialUiTextFieldProps> = function ({
    name,
    validateFunctions = [],
    ...otherProps
}): JSX.Element {
    // We muse use form provider in upper form to be able to have a context
    const {
        control,
        formState: { errors },
    } = useFormContext()

    // do not use _.omit, going to be deprecated in lodash 5 for perf issues
    const nativeProps: MaterialUiTextFieldProps = { ...otherProps }
    if (validateFunctions.filter((validator) => validator.name === 'required').length) {
        nativeProps.required = true
    }
    if (!('label' in nativeProps)) {
        nativeProps.label = name
    }
    if ('style' in nativeProps && nativeProps.style !== undefined && !('display' in nativeProps.style)) {
        nativeProps.style = { ...nativeProps.style, display: 'flex' }
    }

    return (
        <Controller
            name={name}
            control={control}
            // @ts-ignore
            // https://github.com/react-hook-form/react-hook-form/pull/5574 waiting for PR.
            rules={{ validate: validators(validateFunctions) }}
            render={({ field }) => (
                <MaterialUiNativeTextField
                    {...field}
                    {...nativeProps}
                    error={_.has(errors, name)}
                    helperText={_.has(errors, name) ? _.get(errors, `${name}.message`) : ''}
                />
            )}
        />
    )
}

/**
 * Ui shared text field adapted to materialui.
 *
 * @param props Generic props for text field.
 * @returns Text field.
 */
export const TextField: FC<UiTextFieldProps> = function (props): JSX.Element {
    // We muse use form provider in upper form to be able to have a context
    return (
        <MuiTextField
            // This is the default variant of textfield with material ui
            variant="outlined"
            style={{ marginBottom: '20px' }}
            {...props}
        />
    )
}

/**
 * Ui shared password field adapted to materialui.
 *
 * @param props Generic props for text field.
 * @returns Password field.
 */
export const PasswordField: FC<UiTextFieldProps> = function (props) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <MuiTextField
            // This is the default variant of textfield with material ui
            variant="outlined"
            style={{ marginBottom: '20px' }}
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            InputProps={{
                // <-- This is where the toggle button is added.
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="Toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <Icon>visibility_off</Icon> : <Icon>visibility</Icon>}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            {...props}
        />
    )
}

/**
 * Checkbox props.
 */
export interface CheckboxProps {
    /**
     * Label.
     */
    label: FormControlLabelProps['label']
    /**
     * Name of the field.
     */
    name: string
    /**
     * List of validators.
     */
    validate?: FieldValidate
    /**
     * Material UI specific field, should be removed.
     */
    formControlProps?: FormControlProps
    /**
     * Material UI specific field, should be removed.
     */
    formControlLabelProps?: Partial<FormControlLabelProps>
    /**
     * Require information of the field (this is duplcated with the validate, should be removed).
     */
    required?: boolean
    /**
     * Disable information of the field.
     */
    disabled?: boolean
    /**
     * Material ui specific field, should be removed.
     */
    fullWidth?: boolean
    /**
     * Material ui specific field, should be removed.
     */
    color?: 'primary' | 'secondary'
    /**
     * Material ui specific field, should be removed.
     */
    defaultValue?: boolean
}
// TODO test Checkox Component.
/**
 * Material UI Checkbox reusable component.
 *
 * @param props Checkbox Props.
 * @returns Checkbox field.
 */
export const Checkbox: FC<CheckboxProps> = function (props): JSX.Element {
    const { color, disabled, formControlProps, fullWidth, label, name, required, validate, formControlLabelProps } =
        props

    const {
        formState: { errors },
        register,
        setValue,
    } = useFormContext()

    /**
     * Handle changes in the field.
     *
     * @param event Change event.
     */
    const handleChange = function (event: ChangeEvent<HTMLInputElement>) {
        setValue(name, event.target.checked)
    }

    const registerOptions: RegisterOptions = useMemo(() => {
        let options: RegisterOptions = {}
        options.validate = _.isArray(validate) ? (validators(validate) as any) : {}
        return options
    }, [validate])

    React.useEffect(() => {
        register(name, registerOptions)
    }, [register, name, registerOptions])

    return (
        <FormControl
            required={required}
            disabled={disabled}
            fullWidth={fullWidth}
            color={color}
            {...formControlProps}
            error={_.has(errors, name)}
        >
            <FormControlLabel
                label={label}
                control={
                    <CheckboxUI color="primary" id={name} onChange={handleChange} sx={{ pointerEvents: 'auto' }} />
                }
                sx={{ marginLeft: '0px', pointerEvents: 'none', marginTop: '10px' }}
                labelPlacement="end"
                {...formControlLabelProps}
            />
            {_.has(errors, name) && <FormHelperText id={name}>{_.get(errors, `${name}.message`)}</FormHelperText>}
        </FormControl>
    )
}
