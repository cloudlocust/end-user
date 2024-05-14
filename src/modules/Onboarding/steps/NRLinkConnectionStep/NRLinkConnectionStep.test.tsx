import { screen, waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { NRLinkConnectionStep } from 'src/modules/Onboarding/steps/NRLinkConnectionStep'
import { NRLinkConnectionStepProps } from 'src/modules/Onboarding/steps/NRLinkConnectionStep/NRLinkConnectionStep.types'
import userEvent from '@testing-library/user-event'
import { axios } from 'src/common/react-platform-components'
import { API_RESOURCES_URL } from 'src/configs'
import { SET_SHOW_NRLINK_POPUP_ENDPOINT } from 'src/modules/nrLinkConnection/NrLinkConnection'

const NEXT_BUTTON_TEXT = 'Suivant'
const REQUIRED_ERROR_TEXT = 'Champ obligatoire non renseigné'

const guidNrlinkInputQuerySelector = 'input[name="guidVariantPart"]'

const ERRROR_NRLINK_NO_DATA_MESSAGE = "Votre nrLINK ne reçoit pas de données vérifier qu'il est connecté au Wifi"
const INVALID_NRLINK_GUID_FIELD_ERROR =
    'Veuillez entrer un N° GUID valide (6 caractères, chiffre de 0 à 9, lettre de A à F, pas d’espace ni de tiret)'
const ERRROR_NRLINK_ALREADY_CONNECTED_MESSAGE =
    'Votre nrLINK est déjà connecté à un autre compteur, veuillez réessayer ou contacter votre Boucle Locale'
const GENERIC_ERRROR_NRLINK_AUTHORIZE_MESSAGE = 'Erreur lors de la connection de votre compteur'

let mockManualContractFillingIsEnabled = true
const mockHistoryPush = jest.fn()
const mockEnqueueSnackbar = jest.fn()
const mockHandleNext = jest.fn()
const mockAxiosPost = jest.fn()
const mockAxiosPatch = jest.fn()

jest.mock('axios')

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
    /**
     * Mock useHistory hooks.
     *
     * @returns The useHistory hook.
     */
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}))

jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    /**
     * Mock function to check if manual contract filling is enabled.
     *
     * @returns Boolean.
     */
    get manualContractFillingIsEnabled() {
        return mockManualContractFillingIsEnabled
    },
}))

/**
 * Mocking props of NRLinkConnection.
 */
const mockNRLinkConnectionProps: NRLinkConnectionStepProps = {
    housingId: 123,
    onNext: mockHandleNext,
}

describe('Test NRLinkConnection', () => {
    test('should render the component', () => {
        const { getByRole, getAllByRole } = reduxedRender(<NRLinkConnectionStep {...mockNRLinkConnectionProps} />)
        expect(getByRole('form')).toBeTruthy()
        expect(getByRole('textbox')).toBeTruthy()
        expect(getAllByRole('button')).toHaveLength(1)
        expect(screen.getByLabelText('NRLinkConnectionForm')).toBeInTheDocument()
    })

    describe('form validation', () => {
        test('when no meter, defaultValues are empty', () => {
            const { container } = reduxedRender(<NRLinkConnectionStep {...mockNRLinkConnectionProps} />)
            // Initially meter is field and nrlink_empty
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue('')
        })
        test('all fields must be required', async () => {
            const { container, getByText } = reduxedRender(<NRLinkConnectionStep {...mockNRLinkConnectionProps} />)
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue('')
            userEvent.click(getByText(NEXT_BUTTON_TEXT))

            await waitFor(() => {
                expect(getByText(REQUIRED_ERROR_TEXT)).toBeTruthy()
            })
        })

        test('Invalid nrlink guid', async () => {
            const { container, getByText } = reduxedRender(<NRLinkConnectionStep {...mockNRLinkConnectionProps} />)
            // Initially meter is field and nrlink_empty
            userEvent.type(container.querySelector(guidNrlinkInputQuerySelector)!, '12A')
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue('12A')

            userEvent.click(getByText(NEXT_BUTTON_TEXT))
            await waitFor(() => {
                expect(getByText(INVALID_NRLINK_GUID_FIELD_ERROR)).toBeTruthy()
            })
        })
    })

    describe('Submit form', () => {
        test('when submitForm and nrLINK no data received error, snackbar error should be shown', async () => {
            const { container, getByText } = reduxedRender(<NRLinkConnectionStep {...mockNRLinkConnectionProps} />)
            userEvent.type(container.querySelector(guidNrlinkInputQuerySelector)!, 'a1aaaa')
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue('a1aaaa')

            userEvent.click(getByText(NEXT_BUTTON_TEXT))

            await waitFor(
                () => {
                    expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERRROR_NRLINK_NO_DATA_MESSAGE, {
                        autoHideDuration: 5000,
                        variant: 'error',
                    })
                },
                { timeout: 10000 },
            )
        }, 20000)
        test('when submitForm and nrLINK already connected error, snackbar error should be shown', async () => {
            const { container, getByText } = reduxedRender(<NRLinkConnectionStep {...mockNRLinkConnectionProps} />)
            userEvent.type(container.querySelector(guidNrlinkInputQuerySelector)!, 'b2bbbb')
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue('b2bbbb')

            userEvent.click(getByText(NEXT_BUTTON_TEXT))

            await waitFor(
                () => {
                    expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERRROR_NRLINK_ALREADY_CONNECTED_MESSAGE, {
                        autoHideDuration: 5000,
                        variant: 'error',
                    })
                },
                { timeout: 10000 },
            )
        }, 20000)
        test('when submitForm and nrLINK generic error, snackbar error should be shown', async () => {
            const { container, getByText } = reduxedRender(<NRLinkConnectionStep {...mockNRLinkConnectionProps} />)
            userEvent.type(container.querySelector(guidNrlinkInputQuerySelector)!, 'c3cccc')
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue('c3cccc')

            userEvent.click(getByText(NEXT_BUTTON_TEXT))

            await waitFor(
                () => {
                    expect(mockEnqueueSnackbar).toHaveBeenCalledWith(GENERIC_ERRROR_NRLINK_AUTHORIZE_MESSAGE, {
                        autoHideDuration: 5000,
                        variant: 'error',
                    })
                },
                { timeout: 10000 },
            )
        }, 20000)
        test('When submit form works correctly, post nrlink and handle next are called', async () => {
            // mock post & axios Methods
            axios.post = mockAxiosPost
            axios.patch = mockAxiosPatch
            const { container, getByText } = reduxedRender(<NRLinkConnectionStep {...mockNRLinkConnectionProps} />)

            userEvent.type(container.querySelector(guidNrlinkInputQuerySelector)!, '123456')
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue('123456')

            userEvent.click(getByText(NEXT_BUTTON_TEXT))

            await waitFor(() => {
                expect(axios.post).toHaveBeenCalledWith(`${API_RESOURCES_URL}/nrlink/authorize`, {
                    networkIdentifier: mockNRLinkConnectionProps.housingId,
                    nrlinkGuid: '0CA2F40000123456',
                })
                expect(axios.patch).toHaveBeenCalledWith(SET_SHOW_NRLINK_POPUP_ENDPOINT, {
                    showNrlinkPopup: false,
                })
                expect(mockHandleNext).toHaveBeenCalled()
            })
        })
    })
})
