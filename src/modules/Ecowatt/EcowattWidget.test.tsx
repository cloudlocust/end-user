import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_ECOWATT_DATA } from 'src/mocks/handlers/ecowatt'
import { IEcowattData } from 'src/modules/Ecowatt/ecowatt'
import { EcowattWidget, ECOWATT_TITLE } from 'src/modules/Ecowatt/EcowattWidget'

const INFO_ICON = 'InfoOutlinedIcon'
const CLOSE_ICON = 'CloseIcon'
const OFFLINEBOLT_ICON = 'OfflineBoltIcon'
const LOADING_CIRCLE_TEST_ID = 'circular-progress'

let mockEcowattData = applyCamelCase(TEST_ECOWATT_DATA)

const mockDays = ['Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

let mockEcowattWidgetProps = {
    ecowattData: mockEcowattData as IEcowattData,
    isEcowattDataInProgress: false,
}

describe('Ecowatt Widget tests', () => {
    test('Ecowatt widget should be displayed with a helper icon', async () => {
        const { getByText, getByTestId } = reduxedRender(<EcowattWidget {...mockEcowattWidgetProps} />)
        expect(getByText(ECOWATT_TITLE)).toBeTruthy()
        expect(getByTestId(INFO_ICON)).toBeTruthy()
    })
    test('When clicked on the icon button, a tooltip should open with ecowwatt consumption level', async () => {
        const { getByTestId } = reduxedRender(<EcowattWidget {...mockEcowattWidgetProps} />)
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
        mockEcowattWidgetProps.isEcowattDataInProgress = true
        const { getByTestId, rerender, getAllByTestId } = reduxedRender(<EcowattWidget {...mockEcowattWidgetProps} />)

        expect(getByTestId(LOADING_CIRCLE_TEST_ID)).toBeTruthy()

        mockEcowattWidgetProps.isEcowattDataInProgress = false
        rerender(<EcowattWidget {...mockEcowattWidgetProps} />)
        expect(() => getByTestId(LOADING_CIRCLE_TEST_ID)).toThrow()

        mockDays.forEach((day) => expect(day).toBeTruthy())
        expect(getAllByTestId(OFFLINEBOLT_ICON)).toBeTruthy()
    })
    test('when there is no ecowatt data', async () => {
        mockEcowattWidgetProps.isEcowattDataInProgress = true
        const { getByTestId, rerender, getByText } = reduxedRender(<EcowattWidget {...mockEcowattWidgetProps} />)
        await waitFor(() => {
            expect(getByTestId(LOADING_CIRCLE_TEST_ID)).toBeTruthy()
        })

        mockEcowattWidgetProps.ecowattData = []
        mockEcowattWidgetProps.isEcowattDataInProgress = false
        rerender(<EcowattWidget {...mockEcowattWidgetProps} />)
        expect(getByText('Aucune donnée disponible')).toBeTruthy()
    })
})
