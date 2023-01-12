import userEvent from '@testing-library/user-event'
import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_HOUSE_ID } from 'src/mocks/handlers/contracts'
import { TEST_ECOWATT_ALERTS_DATA } from 'src/mocks/handlers/ecowatt'
import { EcowattAlertsForm } from 'src/modules/Layout/Toolbar/components/Alerts/EcowattAlerts/EcowattAlertsForm'

const DISABLED_CLASS = 'Mui-disabled'
const PUSH_SIGNAL_THREE_DAYS_SWITCH_TEST_ID = 'isPushSignalThreeDays-switch'
const PUSH_SIGNAL_ONE_DAY_SWITCH_TEST_ID = 'isPushSignalOneDay-switch'

let ecowattAlertsData = applyCamelCase(TEST_ECOWATT_ALERTS_DATA)

let mockEcowattAlertsFormProps = {
    houseId: TEST_HOUSE_ID,
    ecowattAlerts: ecowattAlertsData,
    updateEcowattAlerts: jest.fn(),
    reloadAlerts: jest.fn(),
}

describe('EcowattAlertsForm tests', () => {
    test('when switch buttons are disabled initially', async () => {
        const { getByTestId } = reduxedRender(<EcowattAlertsForm {...mockEcowattAlertsFormProps} />)

        const isPushSignalThreeDaysSwitch = getByTestId(PUSH_SIGNAL_THREE_DAYS_SWITCH_TEST_ID)
        const isPushSignalOneDaySwitch = getByTestId(PUSH_SIGNAL_ONE_DAY_SWITCH_TEST_ID)

        expect(isPushSignalThreeDaysSwitch).toHaveClass(DISABLED_CLASS)
        expect(isPushSignalOneDaySwitch).toHaveClass(DISABLED_CLASS)
    })
    test('when clicked on Modifier button, switch buttons are not disabled', async () => {
        const { getByTestId, getByText } = reduxedRender(<EcowattAlertsForm {...mockEcowattAlertsFormProps} />)
        const isPushSignalThreeDaysSwitch = getByTestId(PUSH_SIGNAL_THREE_DAYS_SWITCH_TEST_ID)
        const isPushSignalOneDaySwitch = getByTestId(PUSH_SIGNAL_ONE_DAY_SWITCH_TEST_ID)

        userEvent.click(getByText('Modifier'))

        expect(isPushSignalThreeDaysSwitch).not.toHaveClass(DISABLED_CLASS)
        expect(isPushSignalOneDaySwitch).not.toHaveClass(DISABLED_CLASS)
    })
    test('when clicked on reset, values are reset to the initial ones', async () => {
        const { getByTestId, getByText } = reduxedRender(<EcowattAlertsForm {...mockEcowattAlertsFormProps} />)
        const isPushSignalThreeDaysSwitch = getByTestId(PUSH_SIGNAL_THREE_DAYS_SWITCH_TEST_ID)
        const isPushSignalOneDaySwitch = getByTestId(PUSH_SIGNAL_ONE_DAY_SWITCH_TEST_ID)

        expect(isPushSignalThreeDaysSwitch).toHaveClass(DISABLED_CLASS)
        expect(isPushSignalOneDaySwitch).toHaveClass(DISABLED_CLASS)

        userEvent.click(getByText('Modifier'))
        expect(getByText('Enregistrer')).toBeTruthy()
        expect(isPushSignalThreeDaysSwitch).not.toHaveClass(DISABLED_CLASS)
        expect(isPushSignalOneDaySwitch).not.toHaveClass(DISABLED_CLASS)

        userEvent.click(getByText('Annuler'))
        expect(isPushSignalThreeDaysSwitch).toHaveClass(DISABLED_CLASS)
        expect(isPushSignalOneDaySwitch).toHaveClass(DISABLED_CLASS)
    })
    test('when clicked on Enregistrer, updateEcowattAlerts  functions are called', async () => {
        const { getByText } = reduxedRender(<EcowattAlertsForm {...mockEcowattAlertsFormProps} />)

        userEvent.click(getByText('Modifier'))
        userEvent.click(getByText('Enregistrer'))

        expect(mockEcowattAlertsFormProps.updateEcowattAlerts).toBeCalled()
    })
})
