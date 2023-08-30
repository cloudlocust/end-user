import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { NovuChannelsWithValueAndKey } from '../../Alerts'
import PowerMaxAlert from '.'

const BUTTON_ENREGISTRER = 'Enregistrer'

const CARD_TITLE_TEXT =
    'Cette Alerte vous serra envoyer lorsque votre puissance instantanée atteindra la puissance souscrite dans le contrat'
const PUSH_SWITCH_TEST_ID = 'pushPowerMax-switch'
const EMAIL_SWITCH_TEST_ID = 'emailPowerMax-switch'

const CHECKBOX_TYPE = 'input[type="checkbox"]'

const mockUpdateNovuAlertPreferences = jest.fn()
let mockIsNovuAlertPreferencesLoading = false
let mockRefetchData = jest.fn()
let mockPushDefaultValue = false
let mockEmailDefaultValue = false

let mockInitialAlertPreferencesValues: NovuChannelsWithValueAndKey = {
    push: {
        key: 'isPushPowerMax',
        value: mockPushDefaultValue,
    },
    email: {
        key: 'isEmailPowerMax',
        value: mockEmailDefaultValue,
    },
}

let mockPowerMaxProps = {
    isNovuAlertPreferencesLoading: mockIsNovuAlertPreferencesLoading,
    initialSwitchValues: mockInitialAlertPreferencesValues,
    updateNovuAlertPreferences: mockUpdateNovuAlertPreferences,
    refetchData: mockRefetchData,
}

describe('Test Power Max Alert component.', () => {
    test('When Power max alert mount, component is with correct values.', () => {
        const { getByText, getByTestId } = reduxedRender(
            <BrowserRouter>
                <PowerMaxAlert {...mockPowerMaxProps} />
            </BrowserRouter>,
        )

        // The title is correct
        expect(() => getByText(CARD_TITLE_TEXT)).toBeTruthy()

        // switch are have default values
        const pushSwitch = getByTestId(PUSH_SWITCH_TEST_ID)
        const emailSwitch = getByTestId(EMAIL_SWITCH_TEST_ID)

        expect(pushSwitch).not.toBeChecked()
        expect(emailSwitch).not.toBeChecked()

        // The button save show correctly
        expect(() => getByText(BUTTON_ENREGISTRER)).toBeTruthy()
    })
    test('When changing values and save, value changes and data is refetched.', async () => {
        const { getByText, getByTestId } = reduxedRender(
            <BrowserRouter>
                <PowerMaxAlert {...mockPowerMaxProps} />
            </BrowserRouter>,
        )

        const pushSwitch = getByTestId(PUSH_SWITCH_TEST_ID).querySelector(CHECKBOX_TYPE) as HTMLInputElement
        const emailSwitch = getByTestId(EMAIL_SWITCH_TEST_ID).querySelector(CHECKBOX_TYPE) as HTMLInputElement

        // switch are have default values
        expect(pushSwitch).not.toBeChecked()
        expect(emailSwitch).not.toBeChecked()

        // update switch
        userEvent.click(pushSwitch)
        userEvent.click(emailSwitch)

        // switch values changed
        expect(pushSwitch).toBeChecked()
        expect(emailSwitch).toBeChecked()

        // Click button save
        userEvent.click(getByText(BUTTON_ENREGISTRER))

        // update and refetch data functions called
        await waitFor(() => {
            expect(mockPowerMaxProps.updateNovuAlertPreferences).toBeCalled()
            expect(mockPowerMaxProps.refetchData).toBeCalled()
        })
    })
    test('When changing values and save, values did not change, no calling for update.', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <PowerMaxAlert {...mockPowerMaxProps} />
            </BrowserRouter>,
        )

        // Click button save
        userEvent.click(getByText(BUTTON_ENREGISTRER))

        // update and refetch data functions not called
        await waitFor(() => {
            expect(mockPowerMaxProps.updateNovuAlertPreferences).not.toBeCalled()
            expect(mockPowerMaxProps.refetchData).not.toBeCalled()
        })
    })
})
