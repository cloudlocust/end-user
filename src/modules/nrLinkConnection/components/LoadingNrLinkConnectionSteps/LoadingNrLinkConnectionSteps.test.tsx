import React from 'react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { LoadingNrLinkConnectionSteps } from 'src/modules/nrLinkConnection'
import { TEST_METERS as MOCK_METERS } from 'src/mocks/handlers/meters'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IMeter } from 'src/modules/Meters/Meters'

const mockHistoryPush = jest.fn()
const TEST_METERS: IMeter[] = applyCamelCase(MOCK_METERS)

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
