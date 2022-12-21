import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter } from 'react-router-dom'
import ConsumptionAlert from '.'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'

const INTERVAL_TITLE_DAY = "Seuil d'alerte journalier"
const INTERVAL_TITLE_WEEK = "Seuil d'alerte hebdomadaire"
const INTERVAL_TITLE_MONTH = "Seuil d'alerte mensuel"

const INPUT_DEFAULT_VALUE = 0

const BUTTON_MODIFIER = 'Modifier'
const BUTTON_ENREGISTRER = 'Enregistrer'
const BUTTON_ANNULER = 'Annuler'

const MUI_TEXTFIELD = 'MuiOutlinedInput-input'
const MUI_DISABLED = 'Mui-disabled'

describe('Test Consumption Alert component.', () => {
    test('When consumption alert mount, component is with correct values.', () => {
        const { getByText, container } = reduxedRender(
            <BrowserRouter>
                <ConsumptionAlert interval="day" />
            </BrowserRouter>,
        )

        // The title is correct based on the interval
        expect(() => getByText(INTERVAL_TITLE_DAY)).toBeTruthy()

        // two inputs
        const textFieldMuiElements = container.getElementsByClassName(MUI_TEXTFIELD)
        expect(textFieldMuiElements.length).toBe(2)

        // both inputs are disabled
        expect(textFieldMuiElements[0].classList.contains(MUI_DISABLED)).toBeTruthy()
        expect(textFieldMuiElements[1].classList.contains(MUI_DISABLED)).toBeTruthy()

        // both inputs have default value
        const firstInputValue = textFieldMuiElements[0].getAttribute('value') ?? ''
        expect(parseInt(firstInputValue)).toBe(INPUT_DEFAULT_VALUE)

        const secondInputValue = textFieldMuiElements[1].getAttribute('value') ?? ''
        expect(parseInt(secondInputValue)).toBe(INPUT_DEFAULT_VALUE)

        // The button modifier show correctly
        expect(() => getByText(BUTTON_MODIFIER)).toBeTruthy()
    })
    test('When consumption alert mount, correct title value for week.', () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <ConsumptionAlert interval="week" />
            </BrowserRouter>,
        )

        // The title is correct based on the interval
        expect(() => getByText(INTERVAL_TITLE_WEEK)).toBeTruthy()
    })
    test('When consumption alert mount, correct title value for month.', () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <ConsumptionAlert interval="month" />
            </BrowserRouter>,
        )

        // The title is correct based on the interval
        expect(() => getByText(INTERVAL_TITLE_MONTH)).toBeTruthy()
    })
    test('Clicking on Modify change input state and buttons', async () => {
        const { getByText, container } = reduxedRender(
            <BrowserRouter>
                <ConsumptionAlert interval="week" />
            </BrowserRouter>,
        )

        // two inputs
        const textFieldMuiElements = container.getElementsByClassName(MUI_TEXTFIELD)
        expect(textFieldMuiElements.length).toBe(2)

        // both inputs are disabled
        expect(textFieldMuiElements[0].classList.contains(MUI_DISABLED)).toBeTruthy()
        expect(textFieldMuiElements[1].classList.contains(MUI_DISABLED)).toBeTruthy()

        // The button modifier show correctly
        expect(() => getByText(BUTTON_MODIFIER)).toBeTruthy()

        // Click on modify button

        userEvent.click(getByText(BUTTON_MODIFIER))

        await waitFor(() => {
            expect(() => getByText(BUTTON_ENREGISTRER)).toBeTruthy()
            expect(() => getByText(BUTTON_ANNULER)).toBeTruthy()
        })

        // both inputs are enabled
        const textFieldMuiElementsAfterEnable = container.getElementsByClassName(MUI_DISABLED)
        expect(textFieldMuiElementsAfterEnable.length).toBe(0)
    }, 2000)
})
