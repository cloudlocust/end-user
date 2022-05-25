import { reduxedRender } from 'src/common/react-platform-components/test'
import { LastStepNrLinkConnection } from 'src/modules/nrLinkConnection'
import { waitFor } from '@testing-library/react'
import { TEST_METERS } from 'src/mocks/handlers/meters'
import userEvent from '@testing-library/user-event'
import { IMeter } from 'src/modules/Meters/Meters'
import { URL_CONSUMPTION } from 'src/modules/MyConsumption'

const SUBMIT_BUTTON_TEXT = 'Terminer'
const REQUIRED_ERROR_TEXT = 'Champ obligatoire non renseigné'
const TEST_NRLINK_GUID = '12345123451234'

const guidNrlinkInputQuerySelector = 'input[name="nrlinkGuid"]'
const nameMeterInputQuerySelector = 'input[name="meterName"]'
const SUCCESS_NRLINK_AUTHORIZE_MESSAGE = `Votre nrLINK a bien été connecté au compteur ${TEST_METERS[0].name}, vous pouvez maintenant visualiser votre consommation en direct`
const ERRROR_NRLINK_NO_DATA_MESSAGE = "Votre nrLINK ne reçoit pas de données vérifier qu'il est connecté au Wifi"
const ERRROR_NRLINK_ALREADY_CONNECTED_MESSAGE =
    'Votre nrLINK est déjà connecté à un autre compteur, veuillez réessayer ou contacter votre Boucle Locale'
const GENERIC_ERRROR_NRLINK_AUTHORIZE_MESSAGE = 'Erreur lors de la connection de votre compteur'
const mockHistoryPush = jest.fn()
const mockEnqueueSnackbar = jest.fn()
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

/**
 * Mocking props of AddCustomerPopup.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
const mockLastStepNrLinkConnectionProps: {
    // eslint-disable-next-line jsdoc/require-jsdoc
    handleBack: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    meter: IMeter | null
    // eslint-disable-next-line jsdoc/require-jsdoc
    setIsNrLinkAuthorizeInProgress: React.Dispatch<React.SetStateAction<boolean>>
} = {
    handleBack: jest.fn(),
    meter: null,
    setIsNrLinkAuthorizeInProgress: jest.fn(),
}

describe('Test LastStepNrLinkConnection', () => {
    describe('form validation', () => {
        test('when no meter, defaultValues are empty', () => {
            const { container } = reduxedRender(<LastStepNrLinkConnection {...mockLastStepNrLinkConnectionProps} />)
            // Initially meter is field and nrlink_empty
            expect(container.querySelector(nameMeterInputQuerySelector)).toHaveValue('')
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue('')
        })
        test('all fields required required', async () => {
            mockLastStepNrLinkConnectionProps.meter = TEST_METERS[0]
            const { container, getByText } = reduxedRender(
                <LastStepNrLinkConnection {...mockLastStepNrLinkConnectionProps} />,
            )
            // Initially meter is field and nrlink_empty
            expect(container.querySelector(nameMeterInputQuerySelector)).toHaveValue(TEST_METERS[0].name)
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue('')

            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))

            await waitFor(() => {
                expect(getByText(REQUIRED_ERROR_TEXT)).toBeTruthy()
            })
        })
    })

    describe('Submit form', () => {
        test('when submitForm and nrLink no data received error, snackbar error should be shown, and setNrLinkAuthorizeInProgress should be called accordingly', async () => {
            const mockSetIsNrLinkAuthorizeInProgress = jest.fn()
            mockLastStepNrLinkConnectionProps.setIsNrLinkAuthorizeInProgress = mockSetIsNrLinkAuthorizeInProgress
            const { container, getByText } = reduxedRender(
                <LastStepNrLinkConnection {...mockLastStepNrLinkConnectionProps} />,
            )
            userEvent.type(container.querySelector(guidNrlinkInputQuerySelector)!, 'error1')
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue('error1')

            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
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
        test('when submitForm and nrLink already connected error, snackbar error should be shown, and setNrLinkAuthorizeInProgress should be called accordingly', async () => {
            const mockSetIsNrLinkAuthorizeInProgress = jest.fn()
            mockLastStepNrLinkConnectionProps.setIsNrLinkAuthorizeInProgress = mockSetIsNrLinkAuthorizeInProgress
            const { container, getByText } = reduxedRender(
                <LastStepNrLinkConnection {...mockLastStepNrLinkConnectionProps} />,
            )
            userEvent.type(container.querySelector(guidNrlinkInputQuerySelector)!, 'error2')
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue('error2')

            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
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
        test('when submitForm and nrLink generic error, snackbar error should be shown, and setNrLinkAuthorizeInProgress should be called accordingly', async () => {
            const mockSetIsNrLinkAuthorizeInProgress = jest.fn()
            mockLastStepNrLinkConnectionProps.setIsNrLinkAuthorizeInProgress = mockSetIsNrLinkAuthorizeInProgress
            const { container, getByText } = reduxedRender(
                <LastStepNrLinkConnection {...mockLastStepNrLinkConnectionProps} />,
            )
            userEvent.type(container.querySelector(guidNrlinkInputQuerySelector)!, 'error3')
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue('error3')

            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))

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
        test('when submitForm and nrLink authorize success, snackbar error should be shown, and setNrLinkAuthorizeInProgress should be called accordingly', async () => {
            const mockSetIsNrLinkAuthorizeInProgress = jest.fn()
            mockLastStepNrLinkConnectionProps.setIsNrLinkAuthorizeInProgress = mockSetIsNrLinkAuthorizeInProgress
            const { container, getByText } = reduxedRender(
                <LastStepNrLinkConnection {...mockLastStepNrLinkConnectionProps} />,
            )
            userEvent.type(container.querySelector(guidNrlinkInputQuerySelector)!, TEST_NRLINK_GUID)
            expect(container.querySelector(guidNrlinkInputQuerySelector)).toHaveValue(TEST_NRLINK_GUID)

            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))

            await waitFor(() => {
                expect(mockSetIsNrLinkAuthorizeInProgress).toHaveBeenCalledWith(true)
            })
            await waitFor(
                () => {
                    expect(mockHistoryPush).toHaveBeenCalledWith(URL_CONSUMPTION)
                },
                { timeout: 10000 },
            )
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(SUCCESS_NRLINK_AUTHORIZE_MESSAGE, {
                autoHideDuration: 5000,
                variant: 'success',
            })
            expect(mockSetIsNrLinkAuthorizeInProgress).toHaveBeenCalledWith(false)
        }, 20000)
    })
})
