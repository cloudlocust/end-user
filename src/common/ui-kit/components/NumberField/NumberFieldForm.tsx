import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { INumberFieldForm, NumberField } from './NumberField'

/**
 * Common Ui text field interface between different ui kits. We pick common text field from basic ui kit, and add validatefunctions
 * We also override the name to make it required.
 */
interface INumberField extends INumberFieldForm {
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
 * @returns Material UI text field wrapped.
 */
export const NumberFieldForm = ({ name, ...otherProps }: INumberField) => {
    // We muse use form provider in upper form to be able to have a context
    const { control, setValue } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }: any) => (
                <NumberField
                    {...field}
                    {...otherProps}
                    onBlur={(value: any) => {
                        setValue(name, value)
                    }}
                    value={otherProps.value}
                />
            )}
        />
    )
}
