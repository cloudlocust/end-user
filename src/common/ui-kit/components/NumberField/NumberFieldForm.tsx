import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { INumberFieldForm, NumberFieldForm } from './NumberField'

/**
 * Interface INumberField with field name, extending INumberFieldForm .
 */
export interface INumberField extends INumberFieldForm {
    /**
     * Required name field.
     */
    name: string
}

/**
 * A wrapper for NumberField. It must be placed with an upper from context from form hooks.
 *
 * @param root0 Diffeent props of NumberField.
 * @param root0.name The name of the field.
 * @returns NumberField wrapped.
 */
export const NumberField = ({ name, ...otherProps }: INumberField) => {
    // We use use form provider in upper form to be able to have a context

    const { control, setValue } = useFormContext()
    useEffect(() => {
        setValue(name, otherProps.value)
    }, [name, otherProps.value, setValue])

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <NumberFieldForm
                    {...field}
                    {...otherProps}
                    onBlur={(value: number) => {
                        console.log(value)
                        setValue(name, value)
                    }}
                    value={otherProps.value}
                />
            )}
        />
    )
}
