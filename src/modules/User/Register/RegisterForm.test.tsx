import React from 'react'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { RegisterForm } from 'src/modules/User/Register/RegisterForm'
import { act } from 'react-dom/test-utils'
import { ADDRESS_TESTID } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/GoogleMapsAddressAutoCompleteField.test'
import userEvent from '@testing-library/user-event'
import { TEST_SUCCESS_USER } from 'src/mocks/handlers/user'
import dayjs from 'dayjs'

// ============================================ this part is for required data to mock the address field ===============
/**
 *
 */
export const suggestionData = [
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

const mockSetValue = jest.fn((data) => null)
const mockInit = jest.fn(() => null)
const formatted_addr_data = 'normal formatted_address'
const formatted_test_locality = 'test locality'
const INVALID_PASSWORD_FIELD_ERROR =
    'Votre mot de passe doit contenir au moins 8 caractères dont 1 Maj, 1 min, 1 chiffre et un caractère spécial'
const formatted_test_country = 'test country'
const CHECKBOX_RGPD_ERROR_TEXT = 'Ce champ est obligatoire'
// eslint-disable-next-line jsdoc/require-jsdoc
export const passwordQuerySelector = 'input[name="password"]'
const VALIDER_TEXT = 'Valider'
const BIRTHDATE_lABEL = 'Date de naissance (optionnel)'

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
    getLatLng: (data: any) => ({ lat: 1, lng: 2 }),
    // eslint-disable-next-line jsdoc/require-jsdoc
    getZipCode: (data: any, boolean: boolean) => '1234',
}))
// ============================================  ===============

/**
 * Civility Option has two properties: (label that shown in the front visual) and (value that goes to the backend).
 * For Monsieur (label="Mr" and value="Mr").
 * For Madame (label="Mme" and value="Mrs").
 */
const TEST_CIVILITY_OPTION = { label: 'Mr', value: 'Mr' }
const TEST_EMAIL = 'email@email.com'

const mockOnSubmit = jest.fn((data) => null)

jest.mock('src/modules/User/Register/hooks', () => ({
    ...jest.requireActual('src/modules/User/Register/hooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useRegister: () => ({
        isRegisterInProgress: false,
        onSubmit: mockOnSubmit,
    }),
}))

/**
 * Function to fill all fields of form except RGPD checkbox.
 *
 * @param getByRole GetByRole Jest.
 * @param container Container Jest.
 * @param getByTestId GetByTestId Jest.
 */
const fillFormWithData = async (getByRole: Function, container: HTMLElement, getByTestId: Function) => {
    // select civility is a select element that should be selected with getByLabelText
    const civilitySelectField = screen.getByLabelText('Civilité *')
    userEvent.click(civilitySelectField)
    expect(screen.getAllByRole('option').length).toBe(2)
    userEvent.click(screen.getByText(TEST_CIVILITY_OPTION.label))
    expect(civilitySelectField.innerHTML).toBe(TEST_CIVILITY_OPTION.label)

    const companyName = getByRole('textbox', { name: 'Raison sociale' })
    userEvent.type(companyName, TEST_SUCCESS_USER.company_name)
    const siren = getByRole('textbox', { name: 'Siren' })
    userEvent.type(siren, TEST_SUCCESS_USER.siren)
    const firstNameField = getByRole('textbox', { name: 'Prénom' })
    userEvent.type(firstNameField, 'test prénom')
    const lastNameField = getByRole('textbox', { name: 'Nom' })
    userEvent.type(lastNameField, 'test nom')
    const emailField = getByRole('textbox', { name: 'Email' })
    userEvent.type(emailField, TEST_EMAIL)
    const phoneField = getByRole('textbox', { name: 'Numéro de téléphone' })
    userEvent.type(phoneField, '123456789')
    // Be careful password is not a role
    // https://github.com/testing-library/dom-testing-library/issues/567
    // To get the element password you can use this: const getByLabelText(/password/i)
    const passwordField = container.querySelector(passwordQuerySelector) as Element
    userEvent.type(passwordField, 'P@ssword1')
    const repeatPasswordField = container.querySelector('input[name="repeatPwd"]') as Element
    userEvent.type(repeatPasswordField, 'P@ssword1')
    const addressField = within(getByTestId(ADDRESS_TESTID)).getByRole('textbox') as HTMLInputElement
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
    // keep this await to make sure the field have been correctly field and its value has been set.
    await waitFor(
        () => {
            expect(addressField.value).toEqual(formatted_addr_data)
        },
        { timeout: 3000 },
    )
}

/**
 * Function that enable professional fields.
 *
 * @param getAllByRole GetAllByRole Jest.
 * @param getByText GetByText Jest.
 * @param getByLabelText GetByLabelText Jest.
 */
const handleProfessionalRegistrationType = (
    getAllByRole: typeof screen.getAllByRole,
    getByText: typeof screen.getByText,
    getByLabelText: typeof screen.getByLabelText,
) => {
    const registrationTypeField = getByLabelText('Vous êtes')
    userEvent.click(registrationTypeField)
    expect(getAllByRole('option').length).toBe(2)
    userEvent.click(getByText('Professionnel'))
}

describe('test registerForm', () => {
    test('all fields required', async () => {
        const { getAllByText, getAllByRole, getByText, getByLabelText } = reduxedRender(<RegisterForm />)
        handleProfessionalRegistrationType(getAllByRole, getByText, getByLabelText)
        await act(async () => {
            fireEvent.click(screen.getByText('Valider'))
        })
        expect(getAllByText('Champ obligatoire non renseigné').length).toBe(10)
    })
    test('RGPD checkbox required', async () => {
        const { getAllByText, getByRole, container, getByTestId, getByLabelText, getAllByRole, getByText } =
            reduxedRender(<RegisterForm />)
        handleProfessionalRegistrationType(getAllByRole, getByText, getByLabelText)
        await fillFormWithData(getByRole as Function, container, getByTestId as Function)
        userEvent.click(screen.getByText('Valider'))
        await waitFor(() => {
            expect(getAllByText(CHECKBOX_RGPD_ERROR_TEXT).length).toBe(1)
        })
    }, 25000)
    test('Email format validation', async () => {
        const { getByRole, getAllByText } = reduxedRender(<RegisterForm />)
        await act(async () => {
            const emailField = getByRole('textbox', { name: 'Email' })
            fireEvent.input(emailField, { target: { value: '123456' } })
            fireEvent.click(screen.getByText('Valider'))
        })
        expect(mockOnSubmit).not.toHaveBeenCalled()
        expect(getAllByText("L'email indiqué est invalide.").length).toBe(1)
    })

    test('Password field is invalid', async () => {
        const { container, getAllByText } = reduxedRender(<RegisterForm />)
        const passwordField = container.querySelector(passwordQuerySelector) as Element
        userEvent.type(passwordField, '12345678')
        userEvent.click(screen.getByText(VALIDER_TEXT))
        await waitFor(() => expect(getAllByText(INVALID_PASSWORD_FIELD_ERROR).length).toBe(1))
    })
    test('Repeat password validation', async () => {
        const { container, getAllByText } = reduxedRender(<RegisterForm />)
        await act(async () => {
            const passwordField = container.querySelector(passwordQuerySelector)
            expect(passwordField).not.toBe(null)
            // This condition is only to prevent tscript from yelling.
            if (passwordField !== null) {
                fireEvent.input(passwordField, { target: { value: '123456' } })
            }
            const repeatPasswordField = container.querySelector('input[name="repeatPwd"]')
            expect(repeatPasswordField).not.toBe(null)
            // This condition is only to prevent tscript from yelling.
            if (repeatPasswordField !== null) {
                fireEvent.input(repeatPasswordField, { target: { value: '12345' } })
            }
            fireEvent.click(screen.getByText('Valider'))
        })
        expect(mockOnSubmit).not.toHaveBeenCalled()
        expect(getAllByText('Les mot de passes ne correspondent pas.').length).toBe(1)
    })
    test('Normal case with call to submit', async () => {
        const { getByRole, getByTestId, container, getByLabelText, getAllByRole, getByText } = reduxedRender(
            <RegisterForm defaultRole="defaultRle" />,
        )
        const registrationTypeField = getByLabelText('Vous êtes')
        userEvent.click(registrationTypeField)
        expect(getAllByRole('option').length).toBe(2)
        userEvent.click(getByText('Professionnel'))

        await fillFormWithData(getByRole as Function, container, getByTestId as Function)
        const checkboxRGPD = container.querySelector('input[name="rgpdCheckbox"]') as Element
        userEvent.click(checkboxRGPD)
        userEvent.click(screen.getByText(VALIDER_TEXT))

        //! not finding a way to test when the input value is filled.
        userEvent.click(getByLabelText(BIRTHDATE_lABEL))
        await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy())

        expect(screen.getByText('Valider')).toBeTruthy()
        await waitFor(
            () => {
                expect(mockOnSubmit).toHaveBeenCalledWith({
                    companyName: TEST_SUCCESS_USER.company_name,
                    siren: TEST_SUCCESS_USER.siren,
                    civility: TEST_CIVILITY_OPTION.value,
                    email: TEST_EMAIL,
                    firstName: 'test prénom',
                    lastName: 'test nom',
                    phone: TEST_SUCCESS_USER.phone,
                    /**
                     * TODO: Rewrite the birthdate test.
                     * There is a difficult in simulating the datepicker.
                     * When it's clicked using userEvent.click
                     * It takes the current date.
                     */
                    birthdate: dayjs().format('DD/MM/YYYY'),
                    password: 'P@ssword1',
                    address: {
                        city: 'test locality',
                        country: 'test country',
                        lat: 1,
                        lng: 2,
                        name: 'normal formatted_address',
                        placeId: 'ChIJKwNqoPnEw0cRIwMwh9SYOkI',
                        zipCode: '1234',
                    },
                    role: 'defaultRle',
                })
            },
            { timeout: 3000 },
        )
    }, 25000)
    test('if siren field is invalid', async () => {
        const { getByRole, getByText, getAllByRole, getByLabelText } = reduxedRender(<RegisterForm />)
        handleProfessionalRegistrationType(getAllByRole, getByText, getByLabelText)
        const siren = getByRole('textbox', { name: 'Siren' })
        userEvent.type(siren, '123')

        await waitFor(() => {
            expect(getByText('Le numéro Siren doit être composé de 9 chiffres')).toBeTruthy()
        })
    }, 6000)
})
