import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_ECOWATT_DATA } from 'src/mocks/handlers/ecowatt'
import { EcowattWidget, ECOWATT_TITLE } from 'src/modules/Ecowatt/EcowattWidget'

const INFO_ICON = 'InfoOutlinedIcon'
const CLOSE_ICON = 'CloseIcon'
const OFFLINEBOLT_ICON = 'OfflineBoltIcon'
const LOADING_CIRCLE_TEST_ID = 'circular-progress'

let mockIsLoadingInProgress: boolean = false
let mockEcowattData = TEST_ECOWATT_DATA

const mockDays = ['Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

jest.mock('src/modules/Ecowatt/EcowattHook', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    ...jest.requireActual('src/modules/Ecowatt/EcowattHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useEcowatt: () => ({
        ecowattData: mockEcowattData,
        isLoadingInProgress: mockIsLoadingInProgress,
    }),
}))

describe('Ecowatt Widget tests', () => {
    test('Ecowatt widget should be displayed with a helper icon', async () => {
        const { getByText, getByTestId } = reduxedRender(<EcowattWidget />)
        expect(getByText(ECOWATT_TITLE)).toBeTruthy()
        expect(getByTestId(INFO_ICON)).toBeTruthy()
    })
    test('When clicked on the icon button, a tooltip should open with ecowwatt consumption level', async () => {
        const { getByTestId } = reduxedRender(<EcowattWidget />)
        userEvent.click(getByTestId(INFO_ICON))
        expect(getByTestId(CLOSE_ICON)).toBeTruthy()
        userEvent.click(getByTestId(CLOSE_ICON))
        await waitFor(
            () => {
                expect(() => getByTestId(CLOSE_ICON)).toThrow()
            },
            { timeout: 3000 },
        )
    })
    test('Ecowatt widget shuould have 4 buttons, 1 of the current day , 3 of the next days', async () => {
        mockIsLoadingInProgress = true
        const { getByTestId, rerender, getAllByTestId } = reduxedRender(<EcowattWidget />)
        await waitFor(() => {
            expect(getByTestId(LOADING_CIRCLE_TEST_ID)).toBeTruthy()
        })

        mockIsLoadingInProgress = false
        rerender(<EcowattWidget />)
        expect(() => getByTestId(LOADING_CIRCLE_TEST_ID)).toThrow()

        mockDays.forEach((day) => expect(day).toBeTruthy())
        expect(getAllByTestId(OFFLINEBOLT_ICON)).toBeTruthy()
    })
    test('when there is no ecowatt data', async () => {
        mockIsLoadingInProgress = true
        const { getByTestId, rerender, getByText } = reduxedRender(<EcowattWidget />)
        await waitFor(() => {
            expect(getByTestId(LOADING_CIRCLE_TEST_ID)).toBeTruthy()
        })

        mockEcowattData = []
        mockIsLoadingInProgress = false
        rerender(<EcowattWidget />)
        expect(getByText('Aucune donnée disponible')).toBeTruthy()
    })
})
