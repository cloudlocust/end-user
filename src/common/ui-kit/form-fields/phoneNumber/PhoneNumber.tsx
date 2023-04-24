import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
// Firefox and Safari bug from material-ui-phone-number that's why material-ui-phone-number-2 is better.
// https://github.com/alexplumb/material-ui-phone-number/issues/110#issuecomment-1022674548
import MuiPhoneNumber, { MuiPhoneNumberProps } from 'material-ui-phone-number-2'
import { CustomValidateResult, validators } from 'src/common/react-platform-components'
import { phoneNumber } from 'src/common/react-platform-components/form-validators'

/**
 * TODO: add support for counties name localization (probably use i18n-iso-countries package ),
 * wait to https://github.com/alexplumb/material-ui-phone-number/issues/121 pr resolve.
 */

/**
 * Common Ui Select field interface between different ui kits.
 *
 */
export interface PhoneNumberFieldProps extends Omit<MuiPhoneNumberProps, 'onChange'> {
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
}

/**
 * PhoneNumber component wrapped by react-hook-form.
 *
 * @see https://github.com/alexplumb/material-ui-phone-number
 * @param param0 Diffeent props of material ui phone number field.
 * @param param0.name The name of the field.
 * @param param0.label The label of the field.
 * @param param0.validateFunctions Validators of the field, when required is sent, we add some extra params in the field.
 * @param param0.defaultCountry Iso code of the country to display it by default, must be lower case.
 * @returns Material UI PhoneNumber field wrapped.
 */
export const PhoneNumber: FC<PhoneNumberFieldProps> = function ({
    name,
    label,
    validateFunctions = [],
    defaultCountry = 'fr',
    ...otherProps
}) {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            // @ts-ignore
            // https://github.com/react-hook-form/react-hook-form/pull/5574 waiting for PR.
            rules={{ validate: validators([phoneNumber(), ...validateFunctions]) }}
            render={({ field, fieldState }) => (
                <MuiPhoneNumber
                    // by default we set fullWidth true because we use it on 80% of our cases
                    fullWidth={true}
                    variant="outlined"
                    margin="normal"
                    defaultCountry={defaultCountry}
                    label={label}
                    disableAreaCodes={true}
                    {...field}
                    onChange={(value) => {
                        field.onChange({ target: { name, type: 'text', value } })
                    }}
                    error={fieldState.invalid}
                    {...(fieldState.invalid ? { helperText: fieldState.error?.message } : null)}
                    {...otherProps}
                />
            )}
        />
    )
}
