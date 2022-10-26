import { reduxedRender } from 'src/common/react-platform-components/test'
import { MemoryRouter } from 'react-router-dom'
import { EnphaseConfirmState } from 'src/modules/MyHouse/components/EnphaseConfirmState/'

const mockEnqueueSnackbar = jest.fn()

/**
 * Mocking the useSnackbar used in CustomerDetails to load the customerDetails based on url /customers/:id {id} params.
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

describe('EnphaseConfirmState component', () => {
    test('when state=SUCCESS', async () => {
        const { getByText } = reduxedRender(
            <MemoryRouter initialEntries={[{ pathname: '/redirect', search: '?state=SUCCESS' }]}>
                <EnphaseConfirmState />
            </MemoryRouter>,
        )
        expect(getByText('Vous avez donné votre consentement Enphase avec succès')).toBeTruthy()
    })
    test('when state=FAILED', async () => {
        const { getByText } = reduxedRender(
            <MemoryRouter initialEntries={[{ pathname: '/redirect', search: '?state=FAILED' }]}>
                <EnphaseConfirmState />
            </MemoryRouter>,
        )
        expect(getByText('La procédure pour donner votre consentement Enphase à échoué')).toBeTruthy()
    })
    test('when state is neither SUCCESS nor FAILED', async () => {
        reduxedRender(
            <MemoryRouter initialEntries={[{ pathname: '/redirect', search: '?state=' }]}>
                <EnphaseConfirmState />
            </MemoryRouter>,
        )
        expect(mockEnqueueSnackbar).toBeCalledWith('Une érreur est survenue', {
            autoHideDuration: 5000,
            variant: 'error',
        })
    })
})
