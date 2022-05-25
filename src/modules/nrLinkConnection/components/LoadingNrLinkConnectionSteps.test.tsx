import React from 'react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { LoadingNrLinkConnectionSteps } from 'src/modules/nrLinkConnection'
import { TEST_METERS } from 'src/mocks/handlers/meters'

const mockHistoryPush = jest.fn()

const loadingButtonClassName = '.MuiCircularProgress-root '

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}))
describe('Test LoadingNrLinkConnectionSteps Page', () => {
    test('Loading Spinner NrLinkConnection', async () => {
        const { container, getByText } = reduxedRender(<LoadingNrLinkConnectionSteps {...TEST_METERS[0]} />)
        expect(container.querySelector(loadingButtonClassName)).toBeInTheDocument()
        expect(
            getByText(
                'Merci de patienter quelques instants afin que l’appairage de votre appareil termine de se synchroniser. Ceci ne devrait pas dépasser 1 minute.',
            ),
        ).toBeInTheDocument()
    })
})
