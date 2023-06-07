import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { fireEvent, waitFor } from '@testing-library/react'
import EcogesteCard from 'src/modules/Ecogestes/components/ecogesteCard'
import { IEcogeste } from 'src/modules/Ecogestes/components/ecogeste'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_ECOGESTES } from 'src/mocks/handlers/ecogestes'

const fullEcogeste_working_already_read: IEcogeste = applyCamelCase(TEST_ECOGESTES[0])
const fullEcogeste_not_working_not_read: IEcogeste = applyCamelCase(TEST_ECOGESTES[4])
let mockEcogestePropsFull = {}

const gestReadAriaLabel = 'gest is read'
const gestNotReadAriaLabel = 'gest is not read'
const infoboxBtnAriaLabel = 'button, more information about gest'

jest.mock('src/modules/utils/useResizeObserver')

describe('Test EcogesteCard', () => {
    test('When passing elements to ecogeste card they show correctly', async () => {
        const { queryByTestId, queryByText, queryAllByText } = reduxedRender(
            <BrowserRouter>
                <EcogesteCard {...{ ecogeste: fullEcogeste_working_already_read, ...mockEcogestePropsFull }} />
            </BrowserRouter>,
        )

        // Check savings here
        expect(queryByTestId('SavingsIcon')).toBeTruthy()
        expect(queryByText(fullEcogeste_working_already_read.percentageSaved)).toBeTruthy()

        // Check text present
        expect(queryByText(fullEcogeste_working_already_read.title)).toBeTruthy()
        expect(queryAllByText(fullEcogeste_working_already_read.description)).toBeTruthy()
    })
    describe('Test interactions with the setVisibility button', () => {
        test('When button is clicked and no errors, icon changes', async () => {
            const { queryByLabelText } = reduxedRender(
                <BrowserRouter>
                    <EcogesteCard {...{ ecogeste: fullEcogeste_working_already_read, ...mockEcogestePropsFull }} />
                </BrowserRouter>,
            )

            const visibilityBtn = queryByLabelText('toggle, read')
            expect(visibilityBtn).toBeTruthy()

            let readIcon = queryByLabelText(gestReadAriaLabel)
            let notReadIcon = queryByLabelText(gestNotReadAriaLabel)
            expect(readIcon).toBeTruthy()
            expect(notReadIcon).toBeFalsy()

            fireEvent.click(visibilityBtn!)

            readIcon = queryByLabelText(gestReadAriaLabel)
            notReadIcon = queryByLabelText(gestNotReadAriaLabel)

            expect(readIcon).toBeFalsy()
            expect(notReadIcon).toBeTruthy()
        })
        test('When button is clicked and errors, icon changes, then revets', async () => {
            const { queryByLabelText } = reduxedRender(
                <BrowserRouter>
                    <EcogesteCard {...{ ecogeste: fullEcogeste_not_working_not_read, ...mockEcogestePropsFull }} />
                </BrowserRouter>,
            )

            const visibilityBtn = queryByLabelText('toggle, read')
            expect(visibilityBtn).toBeTruthy()

            let readIcon = queryByLabelText(gestReadAriaLabel)
            let notReadIcon = queryByLabelText(gestNotReadAriaLabel)
            expect(readIcon).toBeTruthy()
            expect(notReadIcon).toBeFalsy()

            fireEvent.click(visibilityBtn!)

            readIcon = queryByLabelText(gestReadAriaLabel)
            notReadIcon = queryByLabelText(gestNotReadAriaLabel)

            expect(readIcon).toBeFalsy()
            expect(notReadIcon).toBeTruthy()

            await waitFor(
                // The button to reverts state because it failed
                () => {
                    readIcon = queryByLabelText(gestReadAriaLabel)
                    notReadIcon = queryByLabelText(gestNotReadAriaLabel)
                    expect(readIcon).toBeTruthy()
                    expect(notReadIcon).toBeFalsy()
                },
                { timeout: 2000 },
            )
        })
    })
    describe('Test interactions with the infobox button', () => {
        test('When info button is clicked, it opens the info dialog', async () => {
            const { queryByLabelText, queryByRole } = reduxedRender(
                <BrowserRouter>
                    <EcogesteCard {...{ ecogeste: fullEcogeste_working_already_read, ...mockEcogestePropsFull }} />
                </BrowserRouter>,
            )

            const infoboxBtn = queryByLabelText(infoboxBtnAriaLabel)
            expect(infoboxBtn).toBeTruthy()

            expect(queryByRole('dialog')).toBeFalsy()

            fireEvent.click(infoboxBtn!)

            expect(queryByRole('dialog')).toBeTruthy()
        })
    })
    describe('Text elipsing', () => {
        test('when when text is Elipsed', async () => {
            const { getByTestId } = reduxedRender(
                <BrowserRouter>
                    <EcogesteCard {...{ ecogeste: fullEcogeste_working_already_read, ...mockEcogestePropsFull }} />
                </BrowserRouter>,
            )

            const seeMoreButton = getByTestId('should-ellipse-text')

            expect(seeMoreButton).toBeInTheDocument()
        })
    })
})
