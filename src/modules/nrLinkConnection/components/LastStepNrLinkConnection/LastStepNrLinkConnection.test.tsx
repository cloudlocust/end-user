import { reduxedRender } from 'src/common/react-platform-components/test'
import { LastStepNrLinkConnection } from 'src/modules/nrLinkConnection'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axios } from 'src/common/react-platform-components'
import { URL_DASHBOARD } from 'src/modules/Dashboard/DashboardConfig'
import { API_RESOURCES_URL } from 'src/configs'
import { SET_SHOW_NRLINK_POPUP_ENDPOINT } from 'src/modules/nrLinkConnection/NrLinkConnection'
import { LastStepNrLinkConnectionProps } from 'src/modules/nrLinkConnection/components/LastStepNrLinkConnection/LastStepNrLinkConnection.d'

// List of houses to add to the redux state
const NEXT_BUTTON_TEXT = 'Suivant'
const REQUIRED_ERROR_TEXT = 'Champ obligatoire non renseigné'

const guidNrlinkInputQuerySelector = 'input[name="nrlinkGuid"]'
const ERRROR_NRLINK_NO_DATA_MESSAGE = "Votre nrLINK ne reçoit pas de données vérifier qu'il est connecté au Wifi"
const INVALID_NRLINK_GUID_FIELD_ERROR =
    'Veuillez entrer un N° GUID valide (16 caractères, chiffre de 0 à 9, lettre de A à F, pas d’espace ni de tiret)'
const ERRROR_NRLINK_ALREADY_CONNECTED_MESSAGE =
    'Votre nrLINK est déjà connecté à un autre compteur, veuillez réessayer ou contacter votre Boucle Locale'
const GENERIC_ERRROR_NRLINK_AUTHORIZE_MESSAGE = 'Erreur lors de la connection de votre compteur'
const VALID_NRLINK_GUID = 'bbbbb2bbbbb2bbbb'
let mockManualContractFillingIsEnabled = true
const mockHistoryPush = jest.fn()
const mockEnqueueSnackbar = jest.fn()
const mockSetIsNrLinkAuthorizeInProgress = jest.fn()
const mockHandleNext = jest.fn()
const mockAxiosPost = jest.fn()
const mockAxiosPatch = jest.fn()

/**
 * Mocking the useSnackbar.
 */
jest.mock('notistack', () => ({
    ...jest.requireActual('notistack'),
    /**
     * Mock the notistack useSnackbar hooks.
     *
     * @returns The notistack useSnackbar hook.
     */
    useSnackbar: () => ({
        enqueueSnackbar: mockEnqueueSnackbar,
    }),
}))

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}))

jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get manualContractFillingIsEnabled() {
        return mockManualContractFillingIsEnabled
    },
}))

/**
 * Mocking props of AddCustomerPopup.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
const mockLastStepNrLinkConnectionProps: LastStepNrLinkConnectionProps = {
    handleBack: jest.fn(),
    housingId: 123,
    setIsNrLinkAuthorizeInProgress: mockSetIsNrLinkAuthorizeInProgress,
    handleNext: mockHandleNext,
}

describe('Test LastStepNrLinkConnection', () => {
    describe('form validation', () => {
        test('when no meter, defaultValues are empty', () => {
            const { container } = reduxedRender(<LastStepNrLinkConnection {...mockLastStepNrLinkConnectionProps} />)
            // Initially meter is field and nrlink_empty
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue('')
        })
        test('all fields required required', async () => {
            const { container, getByText } = reduxedRender(
                <LastStepNrLinkConnection {...mockLastStepNrLinkConnectionProps} />,
            )
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue('')
            userEvent.click(getByText(NEXT_BUTTON_TEXT))

            await waitFor(() => {
                expect(getByText(REQUIRED_ERROR_TEXT)).toBeTruthy()
            })
        })

        test('Invalid nrlink guid', async () => {
            const { container, getByText } = reduxedRender(
                <LastStepNrLinkConnection {...mockLastStepNrLinkConnectionProps} />,
            )
            // Initially meter is field and nrlink_empty
            userEvent.type(container.querySelector(guidNrlinkInputQuerySelector)!, 'ZFAAAABBBBCCCCDDDD')
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue('ZFAAAABBBBCCCCDDDD')

            userEvent.click(getByText(NEXT_BUTTON_TEXT))

            await waitFor(() => {
                expect(getByText(INVALID_NRLINK_GUID_FIELD_ERROR)).toBeTruthy()
            })
        })
    })

    describe('Submit form', () => {
        test('when submitForm and nrLINK no data received error, snackbar error should be shown, and setNrLinkAuthorizeInProgress should be called accordingly', async () => {
            const { container, getByText } = reduxedRender(
                <LastStepNrLinkConnection {...mockLastStepNrLinkConnectionProps} />,
            )
            userEvent.type(container.querySelector(guidNrlinkInputQuerySelector)!, 'aaaaa1aaaaa1aaaa')
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue('aaaaa1aaaaa1aaaa')

            userEvent.click(getByText(NEXT_BUTTON_TEXT))
            // Test that
            await waitFor(() => {
                expect(mockSetIsNrLinkAuthorizeInProgress).toHaveBeenCalledWith(true)
            })
            await waitFor(
                () => {
                    expect(mockSetIsNrLinkAuthorizeInProgress).toHaveBeenCalledWith(false)
                },
                { timeout: 10000 },
            )
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERRROR_NRLINK_NO_DATA_MESSAGE, {
                autoHideDuration: 5000,
                variant: 'error',
            })
        }, 20000)
        test('when submitForm and nrLINK already connected error, snackbar error should be shown, and setNrLinkAuthorizeInProgress should be called accordingly', async () => {
            const { container, getByText } = reduxedRender(
                <LastStepNrLinkConnection {...mockLastStepNrLinkConnectionProps} />,
            )
            userEvent.type(container.querySelector(guidNrlinkInputQuerySelector)!, VALID_NRLINK_GUID)
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue(VALID_NRLINK_GUID)

            userEvent.click(getByText(NEXT_BUTTON_TEXT))
            await waitFor(() => {
                expect(mockSetIsNrLinkAuthorizeInProgress).toHaveBeenCalledWith(true)
            })
            await waitFor(
                () => {
                    expect(mockSetIsNrLinkAuthorizeInProgress).toHaveBeenCalledWith(false)
                },
                { timeout: 10000 },
            )
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERRROR_NRLINK_ALREADY_CONNECTED_MESSAGE, {
                autoHideDuration: 5000,
                variant: 'error',
            })
        }, 20000)
        test('when submitForm and nrLINK generic error, snackbar error should be shown, and setNrLinkAuthorizeInProgress should be called accordingly', async () => {
            const { container, getByText } = reduxedRender(
                <LastStepNrLinkConnection {...mockLastStepNrLinkConnectionProps} />,
            )
            userEvent.type(container.querySelector(guidNrlinkInputQuerySelector)!, 'ccccc3ccccc3cccc')
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue('ccccc3ccccc3cccc')

            userEvent.click(getByText(NEXT_BUTTON_TEXT))

            await waitFor(() => {
                expect(mockSetIsNrLinkAuthorizeInProgress).toHaveBeenCalledWith(true)
            })
            await waitFor(
                () => {
                    expect(mockSetIsNrLinkAuthorizeInProgress).toHaveBeenCalledWith(false)
                },
                { timeout: 10000 },
            )
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(GENERIC_ERRROR_NRLINK_AUTHORIZE_MESSAGE, {
                autoHideDuration: 5000,
                variant: 'error',
            })
        }, 20000)
        test('When submit form works correctly, post nrlink and handle next are called', async () => {
            const originalAxiosPost = axios.post
            const originalAxiosPatch = axios.patch

            // mock post & axios Methods
            axios.post = mockAxiosPost
            axios.patch = mockAxiosPatch

            const { container, getByText } = reduxedRender(
                <LastStepNrLinkConnection {...mockLastStepNrLinkConnectionProps} />,
            )

            userEvent.type(container.querySelector(guidNrlinkInputQuerySelector)!, VALID_NRLINK_GUID)
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue(VALID_NRLINK_GUID)

            userEvent.click(getByText(NEXT_BUTTON_TEXT))

            await waitFor(() => {
                expect(mockSetIsNrLinkAuthorizeInProgress).toHaveBeenCalledWith(true)
            })

            expect(mockAxiosPost).toHaveBeenCalledWith(`${API_RESOURCES_URL}/nrlink/authorize`, {
                networkIdentifier: mockLastStepNrLinkConnectionProps.housingId,
                nrlinkGuid: VALID_NRLINK_GUID,
            })

            expect(mockAxiosPatch).toHaveBeenCalledWith(`${SET_SHOW_NRLINK_POPUP_ENDPOINT}`, {
                showNrlinkPopup: false,
            })

            expect(mockSetIsNrLinkAuthorizeInProgress).toHaveBeenCalledWith(false)

            axios.post = originalAxiosPost
            axios.patch = originalAxiosPatch
        })
        test('When manual contract filling is disabled, redirect to my-consuption page, instead of calling handle next', async () => {
            mockManualContractFillingIsEnabled = false

            const originalAxiosPost = axios.post
            const originalAxiosPatch = axios.patch

            // mock post & axios Methods
            axios.post = jest.fn()
            axios.patch = jest.fn()

            const { container, getByText } = reduxedRender(
                <LastStepNrLinkConnection {...mockLastStepNrLinkConnectionProps} />,
            )

            userEvent.type(container.querySelector(guidNrlinkInputQuerySelector)!, VALID_NRLINK_GUID)
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue(VALID_NRLINK_GUID)

            userEvent.click(getByText(NEXT_BUTTON_TEXT))

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(URL_DASHBOARD)
            })

            axios.post = originalAxiosPost
            axios.patch = originalAxiosPatch
        })
    })
})
