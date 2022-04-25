import { GeocodeResult, getLatLng, getZipCode } from 'use-places-autocomplete'

/**
 * Default value format for maps address autocomplete field.
 */
export type defaultValueType =
    /**
     *
     */
    /**
     *
     */ {
        /**
         *
         */
        country: string
        /**
         *
         */
        city: string
        /**
         *
         */
        zipCode: string | null
        /**
         *
         */
        lat: number
        /**
         *
         */
        lng: number
        /**
         *
         */
        name: string
        /**
         *
         */
        addressAddition?: string
        /**
         *
         */
        placeId: string
    }

// TODO Test the following function.
/**
 * This function extract data from GeoCodeResult function.
 *
 * @param result The geocode object.
 * @param useShortName Wether to use shortname to return data.
 * @param dataType Data type to extract, locality, country, etc.
 * @returns Return the value of data type.
 */
export const extractFromGeocode = (result: GeocodeResult, useShortName: false, dataType: string): Promise<string> =>
    new Promise((resolve, reject) => {
        try {
            let extractedElement = null

            result.address_components.forEach(({ long_name, short_name, types }) => {
                if (types.includes(dataType)) extractedElement = useShortName ? short_name : long_name
            })
            if (extractedElement === null) reject('element not found')
            else resolve(extractedElement)
        } catch (error) {
            reject(error)
        }
    })

/**
 * This function returns the default formatted value returned by google maps autocomplete field.
 *
 * @param geocode Geocode selected by a user in the field.
 * @returns Return value of the field.
 */
export const getDefaultFormattedValue = async (geocode: GeocodeResult): Promise<defaultValueType> => {
    const zipCode = await getZipCode(geocode, false)
    const country = await extractFromGeocode(geocode, false, 'country')
    const city = await extractFromGeocode(geocode, false, 'locality')
    const latLng = await getLatLng(geocode)
    return {
        name: geocode.formatted_address,
        placeId: geocode.place_id,
        ...latLng,
        country,
        city,
        zipCode,
    }
}

/**
 * This function extract the place id from the formatted value of the field.
 *
 * @param value Formatted value.
 * @returns Return place id.
 */
export const getDefaultPlaceIdFromValue = (value: defaultValueType) => {
    return value.placeId
}

/**
 * This function return the label to display in the field from the from its formatted value.
 *
 * @param value Formatted value.
 * @returns Return label or null.
 */
export const getDefaultDisplayedLabelFromValue = (value: defaultValueType) => {
    return value?.name ?? null
}

/**
 * This function return the address addition extracted from value.
 *
 * @param value Formatted value.
 * @returns Return label.
 */
export const getDefaultAddressAdditionValue = (value: defaultValueType): string => {
    return value?.addressAddition ?? ''
}

/**
 * This function set the address addition extracted in value.
 *
 * @param addressValue Formatted value.
 * @param newValue New value to set.
 * @returns Return value with address addition.
 */
export const setDefaultAddressAdditionValue = (addressValue: defaultValueType, newValue: string) => {
    return {
        ...addressValue,
        addressAddition: newValue,
    }
}
