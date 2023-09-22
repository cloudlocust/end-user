import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { NovuChannelsWithValueAndKey } from '../../Alerts'
import PowerMaxAlert, { TOOLTIP_TEXT_CONTENT } from '.'

const BUTTON_ENREGISTRER = 'Enregistrer'

const CARD_TITLE_TEXT = 'Choisissez votre mode de notification :'

const PUSH_SWITCH_TEST_ID = 'pushPowerMax-switch'
const EMAIL_SWITCH_TEST_ID = 'emailPowerMax-switch'

const CHECKBOX_TYPE = 'input[type="checkbox"]'

const INFO_ICON = 'InfoOutlinedIcon'
const CLOSE_ICON = 'CloseIcon'

const mockUpdateNovuAlertPreferences = jest.fn()
let mockIsNovuAlertPreferencesLoading = false
let mockOnAfterUpdate = jest.fn()
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
    onAfterUpdate: mockOnAfterUpdate,
}

describe('Test Power Max Alert component.', () => {
    test('When Power max alert mount, component is with correct values. tooltip works.', async () => {
        const { getByText, getByTestId } = reduxedRender(
            <BrowserRouter>
                <PowerMaxAlert {...mockPowerMaxProps} />
            </BrowserRouter>,
        )

        // The title is correct
        expect(getByText(CARD_TITLE_TEXT)).toBeTruthy()

        // Info displayed
        expect(getByTestId(INFO_ICON)).toBeTruthy()

        // test tooltip
        userEvent.click(getByTestId(INFO_ICON))

        expect(getByText(TOOLTIP_TEXT_CONTENT)).toBeTruthy()
        expect(getByTestId(CLOSE_ICON)).toBeTruthy()

        userEvent.click(getByTestId(CLOSE_ICON))
        await waitFor(
            () => {
                expect(() => getByTestId(CLOSE_ICON)).toThrow()
            },
            { timeout: 3000 },
        )

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
            expect(mockPowerMaxProps.onAfterUpdate).toBeCalled()
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
            expect(mockPowerMaxProps.onAfterUpdate).not.toBeCalled()
        })
    })
})
