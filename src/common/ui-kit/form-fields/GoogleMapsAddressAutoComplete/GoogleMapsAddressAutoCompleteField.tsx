import { CustomValidateResult, validators } from 'src/common/react-platform-components'
import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import _ from 'lodash'
import { MutableRefObject, SyntheticEvent, useRef, useEffect } from 'react'
import usePlacesAutocomplete, { GeocodeResult, getGeocode, LatLon } from 'use-places-autocomplete'
import { Suggestion } from 'use-places-autocomplete'
import { useIntl } from 'src/common/react-platform-translation'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import parse from 'autosuggest-highlight/parse'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import {
    defaultValueType,
    getDefaultAddressAdditionValue,
    getDefaultDisplayedLabelFromValue,
    getDefaultFormattedValue,
    getDefaultPlaceIdFromValue,
    setDefaultAddressAdditionValue,
} from './utils'
import { GOOGLE_MAPS_API_KEY } from 'src/configs'

/**
 * Common UI Address AutoComplete field interface between different ui kits.
 */
export interface UiAddressAutoCompleteFieldProps<valueType> {
    /**
     * List of validators.
     */
    validateFunctions?: ((data: any) => CustomValidateResult)[]
    /**
     * Override the default name of material ui to make it required.
     */
    name: string
    /**
     * Override the default value handling.
     */
    valueFunctionsOverride?: /**
     * This fields will be used if we want to override the output object of this field.
     */
    {
        /**
         * This function take a geocode and give the value formatted.
         */
        getFormattedValue: (geocode: GeocodeResult) => Promise<valueType>
        /**
         * This function extract the place id from value.
         */
        getPlaceIdFromValue: (arg: valueType) => string
        /**
         * This function extract the label to display from value.
         */
        getDisplayedLabelFromValue: (arg: valueType) => string
        /**
         * This function extract the address addition from the value.
         */
        getAddressAdditionFromValue: (arg: valueType) => string | undefined
        /**
         * This function extract the address addition from the value.
         */
        setAddressAdditionInValue: (arg: valueType, newValue: string) => void
    }
    /**
     * Disable visual element.
     */
    disabled?: boolean
}

/**
 * Output data format of AddressAutoCompleteField.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type UiAddressAutoCompleteFieldOutputProps = Suggestion & LatLon & { zipCode: string }

/**
 * Function for appending scripts elements to a specific position (head, body, ...) and set the id attribute.
 *
 * @param src The script as a string.
 * @param position The html element to append the script tag to it.
 * @param id The id of the created script tag.
 */
function loadScript(src: string, position: HTMLElement | null, id: string) {
    if (!position) {
        return
    }
    const script = document.createElement('script')
    script.setAttribute('async', '')
    script.setAttribute('id', id)
    script.setAttribute('defer', 'true')
    script.src = src
    position.appendChild(script)
}

/**.
 * Simple custom hook for loading google maps api script
 *
 * @returns Ref object to indicate if loaded or not
 */
const useGoogleScript = (): MutableRefObject<boolean> => {
    const loaded = useRef(false)

    if (typeof window !== 'undefined' && !loaded.current) {
        if (!document.querySelector('#google-maps')) {
            loadScript(
                `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&language=fr`,
                document.querySelector('body'),
                'google-maps',
            )
        }

        loaded.current = true
    }

    return loaded
}

/**
 * This function is the builder to create the address field with its output value format. We create a builder to handle typing with output value.
 * For more infos https://stackoverflow.com/a/53916061/2583534.
 *
 * @returns Return a react component ready to use.
 */
export const GoogleMapsAddressAutoCompleteFieldBuilder = <T extends any>(): FC<UiAddressAutoCompleteFieldProps<T>> => {
    /**
     * This is the address field auto complete component.
     *
     * @param root0 Props.
     * @param root0.name Name of the field.
     * @param root0.validateFunctions Validators functions.
     * @param root0.valueFunctionsOverride Value handling functions to override with output value modification.
     * @param root0.disabled Disable visual element.
     * @returns Return a react component ready to use.
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    function AddressAutoCompleteField({
        name,
        validateFunctions = [],
        valueFunctionsOverride,
        disabled,
    }: UiAddressAutoCompleteFieldProps<T>): JSX.Element {
        const {
            control,
            formState: { errors },
        } = useFormContext()
        const {
            init,
            suggestions: { data },
            setValue: setValueToSearch,
        } = usePlacesAutocomplete({ debounce: 500, initOnMount: false })
        const { current } = useGoogleScript()
        const { formatMessage } = useIntl()
        let required = false
        if (validateFunctions.filter((validator) => validator.name === 'required')) {
            required = true
        }
        useEffect(() => {
            if (current) init()
        })

        const getFormattedValue =
            valueFunctionsOverride === undefined ? getDefaultFormattedValue : valueFunctionsOverride.getFormattedValue

        const getDisplayedLabelFromValue =
            valueFunctionsOverride === undefined
                ? getDefaultDisplayedLabelFromValue
                : valueFunctionsOverride.getDisplayedLabelFromValue
        const getPlaceIdFromValue =
            valueFunctionsOverride === undefined
                ? getDefaultPlaceIdFromValue
                : valueFunctionsOverride.getPlaceIdFromValue
        const getAddressAdditionValue =
            valueFunctionsOverride === undefined
                ? getDefaultAddressAdditionValue
                : valueFunctionsOverride.getAddressAdditionFromValue
        const setAddressAdditionValue =
            valueFunctionsOverride === undefined
                ? setDefaultAddressAdditionValue
                : valueFunctionsOverride.setAddressAdditionInValue
        // We must use form provider in upper form to be able to have a context
        return (
            <Controller
                name={name}
                control={control}
                // @ts-ignore
                // https://github.com/react-hook-form/react-hook-form/pull/5574 waiting for PR.
                rules={{ validate: validators(validateFunctions) }}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                    <>
                        <Autocomplete
                            data-testid="AddressAutoCompleteField"
                            disabled={!!disabled}
                            id="google-map-address-autocomplete"
                            getOptionLabel={(option) => {
                                // This function is called for options and values, when options, use description
                                // if its a value, get the displayed label from the cusomizable function.
                                if ('description' in option) {
                                    return option.description
                                } else return getDisplayedLabelFromValue(option)
                            }}
                            filterOptions={
                                // Seems like onChange TextField inside renderInput props in Autocomplete control can not be used to set options dynamically, As we did in earlier versions.
                                // So we have to use filterOptions props to update the options dynamically.
                                // https://github.com/mui/material-ui/issues/21288
                                (options: Suggestion[], state) => data
                            }
                            options={data}
                            autoComplete
                            value={value === undefined ? null : value}
                            noOptionsText={formatMessage({
                                id: 'Adresse non trouvée',
                                defaultMessage: 'Adresse non trouvée',
                            })}
                            onChange={async (event: SyntheticEvent, newValue: Suggestion | null) => {
                                if (!newValue) {
                                    onChange(null)
                                    return
                                }
                                const geocode = await getGeocode({ placeId: newValue.place_id })
                                const valueToSend = await getFormattedValue(geocode[0])

                                onChange(valueToSend)
                            }}
                            // Value object type is different from data content type.
                            isOptionEqualToValue={(option, value) => {
                                return option.place_id === getPlaceIdFromValue(value)
                            }}
                            renderInput={(params) => (
                                <TextField
                                    required={required}
                                    style={{ marginBottom: '20px', display: 'flex' }}
                                    {...{ ...params, inputProps: { ...params.inputProps, autocomplete: 'no' } }}
                                    onChange={(event) => {
                                        // The set of inputvalue and clear of value must be done in the on change of the text field, to avoid trigger
                                        // a search and a clear of the value when the user select an element (input change event not triggered on
                                        // selection here but triggered in autocomplete)
                                        setValueToSearch(event.target.value)
                                        if (value !== null) {
                                            onChange(null)
                                        }
                                    }}
                                    label={formatMessage({
                                        id: 'Adresse',
                                        defaultMessage: 'Adresse',
                                    })}
                                    fullWidth
                                    helperText={
                                        _.has(errors, name) ? _.get(errors, `${name}.message.props.defaultMessage`) : ''
                                    }
                                    error={_.has(errors, name)}
                                    value={getDisplayedLabelFromValue(value)}
                                />
                            )}
                            renderOption={(props, option) => {
                                const matches = option.structured_formatting.main_text_matched_substrings
                                const parts = parse(
                                    option.structured_formatting.main_text,
                                    matches.map((match: any) => [match.offset, match.offset + match.length]),
                                )
                                return (
                                    <li {...props}>
                                        <Grid container alignItems="center">
                                            <Grid item>
                                                <Box
                                                    component={LocationOnIcon}
                                                    sx={{ color: 'text.secondary', mr: 2 }}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                {parts.map((part, index) => (
                                                    <span
                                                        key={index}
                                                        style={{
                                                            fontWeight: part.highlight ? 700 : 400,
                                                        }}
                                                    >
                                                        {part.text}
                                                    </span>
                                                ))}
                                                <Typography variant="body2" color="text.secondary">
                                                    {option.structured_formatting.secondary_text}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </li>
                                )
                            }}
                        />
                        <TextField
                            inputProps={{ 'data-testid': 'AddressAdditionAutoCompleteField' }}
                            disabled={!!disabled}
                            style={{ marginBottom: '20px', display: 'flex' }}
                            onChange={(event) => {
                                onChange(setAddressAdditionValue(value, event.target.value))
                            }}
                            label={formatMessage({
                                id: "Complément d'adresse",
                                defaultMessage: "Complément d'adresse",
                            })}
                            fullWidth
                            value={getAddressAdditionValue(value)}
                        />
                    </>
                )}
            />
        )
    }
    return AddressAutoCompleteField
}

/**.
 * Google Maps API and React Material UI based autoComplete Component
 *
 * @param root0 Different props of AddressAutoCompleteField field.
 * @param root0.name The name of the field.
 * @param root0.validateFunctions Validators of the field, when required is sent, we add some extra params in the field.
 * @returns GoogleMapsAddressAutoComplete field.
 */
export const GoogleMapsAddressAutoCompleteField = GoogleMapsAddressAutoCompleteFieldBuilder<defaultValueType>()
