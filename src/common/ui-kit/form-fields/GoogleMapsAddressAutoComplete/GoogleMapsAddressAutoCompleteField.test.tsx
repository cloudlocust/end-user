import { FC } from 'react'
import { fireEvent, waitFor, within } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { Form, requiredBuilder } from 'src/common/react-platform-components'
import { ButtonLoader } from 'src/common/ui-kit'
import {
    GoogleMapsAddressAutoCompleteField,
    GoogleMapsAddressAutoCompleteFieldBuilder,
} from './GoogleMapsAddressAutoCompleteField'
import { GeocodeResult } from 'use-places-autocomplete'

// Need a test id because getbylabel because mui add a * to the field, and if we deactivate
// strict mode it will returns multiple elements.
/**
 * Address field test id.
 */
export const ADDRESS_TESTID = 'AddressAutoCompleteField'
const ADDRESS_ADDITION_TESTID = 'AddressAdditionAutoCompleteField'
const mockSetValue = jest.fn((_data) => null)
const mockInit = jest.fn(() => null)
const mockOnSubmit = jest.fn((_data) => {})
const suggestionData = [
    {
        description: 'Rue Général Lotz 37, Uccle, Belgique',
        place_id: 'ChIJKwNqoPnEw0cRIwMwh9SYOkI',
        structured_formatting: {
            main_text: 'Rue Général Lotz 37',
            secondary_text: 'Uccle, Belgique',
            main_text_matched_substrings: [
                {
                    length: 7,
                    offset: 0,
                },
                {
                    length: 2,
                    offset: 17,
                },
            ],
        },
    },
    {
        description: '37 Rue Général de Larminat, Bordeaux, France',
        place_id: 'ChIJUXSNwe0nVQ0RJu1MfaIwZbY',
        structured_formatting: {
            main_text: '37 Rue Général de Larminat',
            secondary_text: 'Bordeaux, France',
            main_text_matched_substrings: [
                {
                    length: 2,
                    offset: 0,
                },
                {
                    length: 7,
                    offset: 3,
                },
            ],
        },
    },
    {
        description: '37 Rue Général Mangin, Grenoble, France',
        place_id: 'ChIJo1WQ1pn0ikcR8eXMBbeo_5s',
        structured_formatting: {
            main_text: '37 Rue Général Mangin',
            secondary_text: 'Grenoble, France',
            main_text_matched_substrings: [
                {
                    length: 2,
                    offset: 0,
                },
                {
                    length: 7,
                    offset: 3,
                },
            ],
        },
    },
    {
        description: '37 Rue Genton, Lyon, France',
        place_id: 'ChIJTy9oE_LB9EcR7mmGhV5S1dY',
        structured_formatting: {
            main_text: '37 Rue Genton',
            secondary_text: 'Lyon, France',
            main_text_matched_substrings: [
                {
                    length: 2,
                    offset: 0,
                },
                {
                    length: 7,
                    offset: 3,
                },
            ],
        },
    },
]
const formatted_addr_data = 'normal formatted_address'
const formatted_test_locality = 'test locality'
const formatted_test_country = 'test country'
const additionalDataContent = 'additional field'

jest.mock('use-places-autocomplete', () => ({
    ...jest.requireActual('use-places-autocomplete'),
    __esModule: true, // this property makes it work
    // eslint-disable-next-line jsdoc/require-jsdoc
    default: () => ({
        setValue: mockSetValue,
        suggestions: {
            data: suggestionData,
        },
        init: mockInit,
    }),
    // eslint-disable-next-line jsdoc/require-jsdoc
    getGeocode: (data: any) => {
        data['formatted_address'] = formatted_addr_data
        data['place_id'] = data.placeId
        data['address_components'] = [
            { long_name: formatted_test_locality, short_name: 'test lc', types: ['locality'] },
            { long_name: formatted_test_country, short_name: 'test cty', types: ['country'] },
        ]
        return [data]
    },
    // eslint-disable-next-line jsdoc/require-jsdoc
    getLatLng: (_data: any) => ({ lat: 1, lng: 2 }),
    // eslint-disable-next-line jsdoc/require-jsdoc
    getZipCode: (_data: any, _boolean: boolean) => '1234',
}))

/**
 * Form used for user Address test.
 *
 * @returns AddressForm form component.
 */
const AddressForm: FC<any> = () => {
    return (
        <Form onSubmit={mockOnSubmit}>
            <GoogleMapsAddressAutoCompleteField name="address" validateFunctions={[requiredBuilder()]} />
            <ButtonLoader type="submit">Submit</ButtonLoader>
        </Form>
    )
}

// eslint-disable-next-line jsdoc/require-jsdoc
type OverrideValueType = {
    /**
     *
     */
    latitude: number
    /**
     *
     */
    longitude: number
    /**
     *
     */
    formatted: string
    /**
     *
     */
    placeId: string
    /**
     *
     */
    addressAddition?: string
}

const GoogleMapsAddressAutoCompleteOverrideField = GoogleMapsAddressAutoCompleteFieldBuilder<OverrideValueType>()

const overrideFunctions = {
    // eslint-disable-next-line jsdoc/require-jsdoc
    getFormattedValue: async (geocode: GeocodeResult) => {
        return { latitude: 1.0, longitude: 1.0, formatted: 'formatted_override', placeId: geocode.place_id }
    },
    // eslint-disable-next-line jsdoc/require-jsdoc
    getPlaceIdFromValue: (arg: OverrideValueType) => {
        return arg?.placeId
    },
    // eslint-disable-next-line jsdoc/require-jsdoc
    getDisplayedLabelFromValue: (arg: OverrideValueType) => {
        return arg?.formatted
    },
    // eslint-disable-next-line jsdoc/require-jsdoc
    getAddressAdditionFromValue: (arg: OverrideValueType) => {
        return arg?.addressAddition
    },
    // eslint-disable-next-line jsdoc/require-jsdoc
    setAddressAdditionInValue: (arg: OverrideValueType, newValue: string): OverrideValueType => {
        return {
            ...arg,
            addressAddition: newValue,
        }
    },
}

/**
 * Form used for user Address test.
 *
 * @returns AddressForm form component.
 */
const AddressOverrideFieldForm: FC<any> = () => {
    return (
        <Form onSubmit={mockOnSubmit}>
            <GoogleMapsAddressAutoCompleteOverrideField
                name="address"
                validateFunctions={[requiredBuilder()]}
                valueFunctionsOverride={overrideFunctions}
            />
            <ButtonLoader type="submit">Submit</ButtonLoader>
        </Form>
    )
}

describe('test AddressForm', () => {
    test('Address required standard address field', async () => {
        const { getByText } = reduxedRender(<AddressForm />)
        await act(async () => {
            fireEvent.click(getByText('Submit'))
        })
        expect(getByText('Champ obligatoire non renseigné')).toBeTruthy()
    })
    test('Address required standard override field', async () => {
        const { getByText } = reduxedRender(<AddressOverrideFieldForm />)
        await act(async () => {
            fireEvent.click(getByText('Submit'))
        })
        expect(getByText('Champ obligatoire non renseigné')).toBeTruthy()
    })

    test('Normal case with call to submit standard address field', async () => {
        const { getByTestId, getByText } = reduxedRender(<AddressForm />)

        await act(async () => {
            const addressField = within(getByTestId(ADDRESS_TESTID)).getByRole('textbox') as HTMLInputElement
            if (addressField !== null) {
                await waitFor(
                    () => {
                        fireEvent.change(addressField, { target: { value: 'a' } })
                    },
                    { timeout: 500 },
                )
                await waitFor(
                    () => {
                        fireEvent.keyDown(addressField, { key: 'ArrowDown' })
                    },
                    { timeout: 500 },
                )
                await waitFor(
                    () => {
                        fireEvent.keyDown(addressField, { key: 'Enter' })
                    },
                    { timeout: 500 },
                )
            }
            await waitFor(
                () => {
                    expect(addressField.value).toEqual(formatted_addr_data)
                },
                { timeout: 3000 },
            )
            fireEvent.click(getByText('Submit'))
            await waitFor(
                () => {
                    expect(mockOnSubmit).toHaveBeenCalledWith(
                        {
                            address: {
                                name: formatted_addr_data,
                                placeId: suggestionData[0].place_id,
                                lat: 1,
                                lng: 2,
                                country: formatted_test_country,
                                city: formatted_test_locality,
                                zipCode: '1234',
                            },
                        },
                        expect.anything(),
                    )
                },
                { timeout: 3000 },
            )
        })
    })

    test('Normal case with call to submit standard address field and additional data', async () => {
        const { getByTestId, getByText } = reduxedRender(<AddressForm />)

        await act(async () => {
            const addressField = within(getByTestId(ADDRESS_TESTID)).getByRole('textbox') as HTMLInputElement
            if (addressField !== null) {
                await waitFor(
                    () => {
                        fireEvent.change(addressField, { target: { value: 'a' } })
                    },
                    { timeout: 500 },
                )
                await waitFor(
                    () => {
                        fireEvent.keyDown(addressField, { key: 'ArrowDown' })
                    },
                    { timeout: 500 },
                )
                await waitFor(
                    () => {
                        fireEvent.keyDown(addressField, { key: 'Enter' })
                    },
                    { timeout: 500 },
                )
            }
            await waitFor(
                () => {
                    expect(addressField.value).toEqual(formatted_addr_data)
                },
                { timeout: 3000 },
            )
            const additionalData = getByTestId(ADDRESS_ADDITION_TESTID) as HTMLInputElement
            if (additionalData !== null) {
                await waitFor(
                    () => {
                        fireEvent.change(additionalData, { target: { value: additionalDataContent } })
                    },
                    { timeout: 500 },
                )
            }
            await waitFor(
                () => {
                    expect(additionalData.value).toEqual(additionalDataContent)
                },
                { timeout: 3000 },
            )
            fireEvent.click(getByText('Submit'))
            await waitFor(
                () => {
                    expect(mockOnSubmit).toHaveBeenCalledWith(
                        {
                            address: {
                                name: formatted_addr_data,
                                placeId: suggestionData[0].place_id,
                                lat: 1,
                                lng: 2,
                                country: formatted_test_country,
                                city: formatted_test_locality,
                                zipCode: '1234',
                                addressAddition: additionalDataContent,
                            },
                        },
                        expect.anything(),
                    )
                },
                { timeout: 3000 },
            )
        })
    })

    test('Normal case with call to submit override address field', async () => {
        const { getByTestId, getByText } = reduxedRender(<AddressOverrideFieldForm />)

        await act(async () => {
            const addressField = within(getByTestId(ADDRESS_TESTID)).getByRole('textbox') as HTMLInputElement
            if (addressField !== null) {
                await waitFor(
                    () => {
                        fireEvent.change(addressField, { target: { value: 'a' } })
                    },
                    { timeout: 500 },
                )
                await waitFor(
                    () => {
                        fireEvent.keyDown(addressField, { key: 'ArrowDown' })
                    },
                    { timeout: 500 },
                )
                await waitFor(
                    () => {
                        fireEvent.keyDown(addressField, { key: 'Enter' })
                    },
                    { timeout: 500 },
                )
            }
            await waitFor(
                () => {
                    expect(addressField.value).toEqual('formatted_override')
                },
                { timeout: 3000 },
            )
            fireEvent.click(getByText('Submit'))
            await waitFor(
                () => {
                    expect(mockOnSubmit).toHaveBeenCalledWith(
                        {
                            address: {
                                latitude: 1.0,
                                longitude: 1.0,
                                formatted: 'formatted_override',
                                placeId: suggestionData[0].place_id,
                            },
                        },
                        expect.anything(),
                    )
                },
                { timeout: 3000 },
            )
        })
    })

    test('Normal case with call to submit override address field with address addition', async () => {
        const { getByTestId, getByText } = reduxedRender(<AddressOverrideFieldForm />)

        await act(async () => {
            const addressField = within(getByTestId(ADDRESS_TESTID)).getByRole('textbox') as HTMLInputElement
            if (addressField !== null) {
                await waitFor(
                    () => {
                        fireEvent.change(addressField, { target: { value: 'a' } })
                    },
                    { timeout: 500 },
                )
                await waitFor(
                    () => {
                        fireEvent.keyDown(addressField, { key: 'ArrowDown' })
                    },
                    { timeout: 500 },
                )
                await waitFor(
                    () => {
                        fireEvent.keyDown(addressField, { key: 'Enter' })
                    },
                    { timeout: 500 },
                )
            }
            await waitFor(
                () => {
                    expect(addressField.value).toEqual('formatted_override')
                },
                { timeout: 3000 },
            )
            const additionalData = getByTestId(ADDRESS_ADDITION_TESTID) as HTMLInputElement
            if (additionalData !== null) {
                await waitFor(
                    () => {
                        fireEvent.change(additionalData, { target: { value: additionalDataContent } })
                    },
                    { timeout: 500 },
                )
            }
            await waitFor(
                () => {
                    expect(additionalData.value).toEqual(additionalDataContent)
                },
                { timeout: 3000 },
            )
            fireEvent.click(getByText('Submit'))
            await waitFor(
                () => {
                    expect(mockOnSubmit).toHaveBeenCalledWith(
                        {
                            address: {
                                latitude: 1.0,
                                longitude: 1.0,
                                formatted: 'formatted_override',
                                placeId: suggestionData[0].place_id,
                                addressAddition: additionalDataContent,
                            },
                        },
                        expect.anything(),
                    )
                },
                { timeout: 3000 },
            )
        })
    })
})
