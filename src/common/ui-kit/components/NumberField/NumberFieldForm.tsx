import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { NumberField } from './NumberField'
import { INumberFieldForm } from './NumberFieldTypes'

/**
 * A wrapper for NumberField. It must be placed with an upper from context from form hooks.
 *
 * @param root0 Diffeent props of NumberField.
 * @param root0.name The name of the field.
 * @returns NumberField wrapped.
 */
export const NumberFieldForm = ({ name, ...otherProps }: INumberFieldForm) => {
    // We use use form provider in upper form to be able to have a context
    const { control, setValue, getValues } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={getValues(name) || otherProps.value || 0}
            render={({ field }) => {
                return (
                    <NumberField
                        {...field}
                        {...otherProps}
                        value={field.value}
                        onChange={(value: number) => setValue(name, value)}
                    />
                )
            }}
        />
    )
}
