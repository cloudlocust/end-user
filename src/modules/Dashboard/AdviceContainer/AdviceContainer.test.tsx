import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_ECOGESTES } from 'src/mocks/handlers/ecogestes'
import { AdviceContainer, ECOGESTES_ITEMS_COUNT } from 'src/modules/Dashboard/AdviceContainer'
import { IEcogeste } from 'src/modules/Ecogestes/components/ecogeste'
import { BrowserRouter as Router } from 'react-router-dom'
import { screen } from '@testing-library/react'

let mockEcogestes: IEcogeste[] = applyCamelCase(TEST_ECOGESTES)
let mockLoadingInProgress = false

jest.mock('src/modules/Ecogestes/hooks/ecogestesHook', () => {
    const og = jest.requireActual('src/modules/Ecogestes/hooks/ecogestesHook')
    /**
     * Mock the useEcogest hook with some
     * predictible values that we can manipulate
     * to check rendering of things.
     *
     * @returns EcogestesHook-like props.
     */
    const mockUseEcogestFn = () => ({
        elementList: mockEcogestes,
        loadingInProgress: mockLoadingInProgress,
    })

    return {
        __esModule: true,
        ...og,
        default: mockUseEcogestFn,
        useEcogestes: mockUseEcogestFn,
    }
})

describe('AdviceContainer tests', () => {
    test('should render the component with all the ecogestes', async () => {
        reduxedRender(
            <Router>
                <AdviceContainer />
            </Router>,
        )
        expect(screen.getByText('advice.svg')).toBeInTheDocument()
        expect(screen.getByText('Conseils du moment')).toBeInTheDocument()
        expect(
            screen.getByText('Voir tous', {
                exact: false,
            }),
        ).toBeInTheDocument()

        expect(
            screen.queryAllByText('Consulter', {
                exact: false,
            }),
        ).toHaveLength(mockEcogestes.length)
    })
    test(`should render at most ${ECOGESTES_ITEMS_COUNT} ecogestes`, async () => {
        reduxedRender(
            <Router>
                <AdviceContainer />
            </Router>,
        )
        const elements = screen.queryAllByText('Consulter', { exact: false })
        expect(elements.length).toBeLessThanOrEqual(6)
    })
})
