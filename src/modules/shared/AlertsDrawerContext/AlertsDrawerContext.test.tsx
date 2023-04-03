import userEvent from '@testing-library/user-event'
import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { Alerts } from 'src/modules/Layout/Toolbar/components/Alerts'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { AlertsDrawerContext } from 'src/modules/shared/AlertsDrawerContext'

let mockIsAlertDrawerOpen = false
let mockOpenAlertsDrawer = jest.fn()
let mockCloseAlertsDrawer = jest.fn()

const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

let mockProviderValueProp = {
    isAlertsDrawerOpen: mockIsAlertDrawerOpen,
    handleOpenAlertsDrawer: mockOpenAlertsDrawer,
    handleCloseAlertsDrawer: mockCloseAlertsDrawer,
}

// eslint-disable-next-line jsdoc/require-jsdoc
const renderTestComponent = () => {
    return reduxedRender(
        <AlertsDrawerContext.Provider value={mockProviderValueProp}>
            <Alerts />
        </AlertsDrawerContext.Provider>,
    )
}

describe('AlertsDrawer Context test', () => {
    test('when AlertsDrawerContext is rendered with default values', async () => {
        renderTestComponent()
        expect(mockIsAlertDrawerOpen).toBeFalsy()
    })

    test('when clicked on openAlertsDrawers, the state should changhe', async () => {
        const { getByTestId } = renderTestComponent()
        userEvent.click(getByTestId('alerts-icon'))
        expect(mockOpenAlertsDrawer).toBeCalled()
    })

    test('AlertsDrawer should be open if isAlertsDrawerOpen is true', async () => {
        mockProviderValueProp.isAlertsDrawerOpen = true
        const { container } = reduxedRender(
            <AlertsDrawerContext.Provider value={mockProviderValueProp}>
                <Alerts />
            </AlertsDrawerContext.Provider>,
            {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
            },
        )
        expect(container.getElementsByClassName('MuiDrawer-paperAnchorRight')).toBeTruthy()
    })
})
