import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { fireEvent } from '@testing-library/react'
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
        const { queryByTestId, queryByLabelText, queryByText, queryByRole } = reduxedRender(
            <BrowserRouter>
                <EcogesteCard {...{ ecogeste: fullEcogeste, ...mockEcogestePropsFull }} />
            </BrowserRouter>,
        )

        // Check savings here
        expect(queryByTestId('SavingsIcon')).toBeTruthy()
        expect(queryByText(fullEcogeste.percentageSaved + '%')).toBeTruthy()

        // Check text present
        expect(queryByText(fullEcogeste.title)).toBeTruthy()
        expect(queryByText(fullEcogeste.description)).toBeTruthy()

        // Check for dialog
        const infoBtn = queryByLabelText('more information')
        expect(infoBtn).toBeTruthy()

        expect(queryByRole('dialog')).toBeFalsy()

        fireEvent.click(infoBtn!)

        expect(queryByRole('dialog')).toBeTruthy()
    })
})
