import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { fireEvent } from '@testing-library/react'
import EcogesteCard from 'src/modules/Ecogestes/components/ecogesteCard'
import { IEcogeste } from 'src/modules/Ecogestes/components/ecogeste'

// Grab the test data from router, so we keep it DRY.
const fullEcogeste: IEcogeste = {
    title: 'Test Ecogeste',
    description: 'Test Description',
    savings: 20,
    shortdescription: 'Test short description',
}
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
        expect(queryByText(fullEcogeste.savings + '%')).toBeTruthy()

        // Check text present
        expect(queryByText(fullEcogeste.title)).toBeTruthy()
        expect(queryByText(fullEcogeste.shortdescription)).toBeTruthy()

        // Check for dialog
        const infoBtn = queryByLabelText('more information')
        expect(infoBtn).toBeTruthy()

        expect(queryByRole('dialog')).toBeFalsy()
        expect(queryByText(fullEcogeste.description)).toBeFalsy()

        fireEvent.click(infoBtn!)

        expect(queryByRole('dialog')).toBeTruthy()
        expect(queryByText(fullEcogeste.description)).toBeTruthy()
    })
})
