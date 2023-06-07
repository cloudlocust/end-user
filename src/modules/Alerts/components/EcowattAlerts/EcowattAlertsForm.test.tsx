import userEvent from '@testing-library/user-event'
import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_HOUSE_ID } from 'src/mocks/handlers/contracts'
import { TEST_NOVU_ALERTS_DATA } from 'src/mocks/handlers/novuAlertPreferences'
import { EcowattAlertsForm } from 'src/modules/Alerts/components/EcowattAlerts/EcowattAlertsForm'

const DISABLED_CLASS = 'Mui-disabled'
const PUSH_SIGNAL_THREE_DAYS_SWITCH_TEST_ID = 'isPushSignalThreeDays-switch'
const PUSH_SIGNAL_ONE_DAY_SWITCH_TEST_ID = 'isPushSignalOneDay-switch'

let novuAlertsData = applyCamelCase(TEST_NOVU_ALERTS_DATA)

let mockEcowattAlertsFormProps = {
    houseId: TEST_HOUSE_ID,
    novuAlertPreferences: novuAlertsData,
    updateEcowattAlerts: jest.fn(),
    reloadAlerts: jest.fn(),
}

describe('EcowattAlertsForm tests', () => {
    test('when mount initially', async () => {
        const { getByTestId } = reduxedRender(<EcowattAlertsForm {...mockEcowattAlertsFormProps} />)

        const isPushSignalThreeDaysSwitch = getByTestId(PUSH_SIGNAL_THREE_DAYS_SWITCH_TEST_ID)
        const isPushSignalOneDaySwitch = getByTestId(PUSH_SIGNAL_ONE_DAY_SWITCH_TEST_ID)

        expect(isPushSignalThreeDaysSwitch).not.toHaveClass(DISABLED_CLASS)
        expect(isPushSignalOneDaySwitch).not.toHaveClass(DISABLED_CLASS)
    })

    test('when clicked on Enregistrer, updateEcowattAlerts  functions are called', async () => {
        const { getByText } = reduxedRender(<EcowattAlertsForm {...mockEcowattAlertsFormProps} />)

        userEvent.click(getByText('Enregistrer'))

        expect(mockEcowattAlertsFormProps.updateEcowattAlerts).toBeCalled()
    })
})
