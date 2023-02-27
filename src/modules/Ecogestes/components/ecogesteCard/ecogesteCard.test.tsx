import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import EcogesteCard from 'src/modules/Ecogestes/components/ecogesteCard'
import { IEcogeste } from 'src/modules/Ecogestes/components/ecogeste'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_ECOGESTES } from 'src/mocks/handlers/ecogestes'

const fullEcogeste: IEcogeste = applyCamelCase(TEST_ECOGESTES[0])
let mockEcogestePropsFull = {}

/**
 * Mock the ResizeObserverAPI.
 */
class ResizeObserver {
    /* eslint-disable jsdoc/require-jsdoc -- enough doc for now */
    observe() {
        // do nothing
    }
    unobserve() {
        // do nothing
    }
    disconnect() {
        // do nothing
    }
}

window.ResizeObserver = ResizeObserver

describe('Test EcogesteCard', () => {
    test('When passing elements to ecogeste card they show correctly', async () => {
        const { queryByTestId, queryByText, queryAllByText } = reduxedRender(
            <BrowserRouter>
                <EcogesteCard {...{ ecogeste: fullEcogeste, ...mockEcogestePropsFull }} />
            </BrowserRouter>,
        )

        // Check savings here
        expect(queryByTestId('SavingsIcon')).toBeTruthy()
        expect(queryByText(fullEcogeste.percentageSaved + '%')).toBeTruthy()

        // Check text present
        expect(queryByText(fullEcogeste.title)).toBeTruthy()
        expect(queryAllByText(fullEcogeste.description)).toBeTruthy()
    })
})
