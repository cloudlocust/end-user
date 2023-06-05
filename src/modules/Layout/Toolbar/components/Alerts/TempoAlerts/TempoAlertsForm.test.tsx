import userEvent from '@testing-library/user-event'
import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_HOUSE_ID } from 'src/mocks/handlers/contracts'
import { TEST_NOVU_ALERTS_DATA } from 'src/mocks/handlers/novuAlertPreferences'
import { TempoAlertsForm } from 'src/modules/Layout/Toolbar/components/Alerts/TempoAlerts/TempoAlertsForm'

const DISABLED_CLASS = 'Mui-disabled'
const PUSH_TEMPO_ALERT_TEST_ID = 'isPushTempoAlert-switch'
const EMAIL_TEMPO_ALERT_TEST_ID = 'isMailTempoAlert-switch'

let novuAlertsData = applyCamelCase(TEST_NOVU_ALERTS_DATA)

let mockTempoAlertsFormProps = {
    houseId: TEST_HOUSE_ID,
    novuAlertPreferences: novuAlertsData,
    updateTempoAlerts: jest.fn(),
    reloadAlerts: jest.fn(),
}

describe('EcowattAlertsForm tests', () => {
    test('when mount initially', async () => {
        const { getByTestId, getByText } = reduxedRender(<TempoAlertsForm {...mockTempoAlertsFormProps} />)

        const isPushSignalThreeDaysSwitch = getByTestId(PUSH_TEMPO_ALERT_TEST_ID)
        const isPushSignalOneDaySwitch = getByTestId(EMAIL_TEMPO_ALERT_TEST_ID)

        expect(getByText('Enregistrer')).toBeTruthy()
        expect(isPushSignalThreeDaysSwitch).not.toHaveClass(DISABLED_CLASS)
        expect(isPushSignalOneDaySwitch).not.toHaveClass(DISABLED_CLASS)
    })
    test('when clicked on Enregistrer, updateEcowattAlerts  functions are called', async () => {
        const { getByText } = reduxedRender(<TempoAlertsForm {...mockTempoAlertsFormProps} />)

        userEvent.click(getByText('Enregistrer'))

        expect(mockTempoAlertsFormProps.updateTempoAlerts).toBeCalled()
    })
})
