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

const mockInitialValue = {
    price: 0,
    consumption: 0,
}
const mockSaveConsumptionAlert = jest.fn()
let mockIsConsumptionAlertsLoading = false
let mockIsSavingAlertLoading = false
const PRICE_PER_KWH = 3

describe('Test Consumption Alert component.', () => {
    describe('Test the UI.', () => {
        test('When consumption alert mount, component is with correct values.', () => {
            const { getByText, container } = reduxedRender(
                <BrowserRouter>
                    <ConsumptionAlert
                        interval="day"
                        initialValues={mockInitialValue}
                        pricePerKwh={PRICE_PER_KWH}
                        saveConsumptionAlert={mockSaveConsumptionAlert}
                        isConsumptionAlertsLoading={mockIsConsumptionAlertsLoading}
                        isSavingAlertLoading={mockIsSavingAlertLoading}
                    />
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
                    <ConsumptionAlert
                        interval="week"
                        initialValues={mockInitialValue}
                        pricePerKwh={PRICE_PER_KWH}
                        saveConsumptionAlert={mockSaveConsumptionAlert}
                        isConsumptionAlertsLoading={mockIsConsumptionAlertsLoading}
                        isSavingAlertLoading={mockIsSavingAlertLoading}
                    />
                </BrowserRouter>,
            )

            // The title is correct based on the interval
            expect(() => getByText(INTERVAL_TITLE_WEEK)).toBeTruthy()
        })
        test('When consumption alert mount, correct title value for month.', () => {
            const { getByText } = reduxedRender(
                <BrowserRouter>
                    <ConsumptionAlert
                        interval="month"
                        initialValues={mockInitialValue}
                        pricePerKwh={PRICE_PER_KWH}
                        saveConsumptionAlert={mockSaveConsumptionAlert}
                        isConsumptionAlertsLoading={mockIsConsumptionAlertsLoading}
                        isSavingAlertLoading={mockIsSavingAlertLoading}
                    />
                </BrowserRouter>,
            )

            // The title is correct based on the interval
            expect(() => getByText(INTERVAL_TITLE_MONTH)).toBeTruthy()
        })
        test('Clicking on Modify change input state and buttons', async () => {
            const { getByText, container } = reduxedRender(
                <BrowserRouter>
                    <ConsumptionAlert
                        interval="week"
                        initialValues={mockInitialValue}
                        pricePerKwh={PRICE_PER_KWH}
                        saveConsumptionAlert={mockSaveConsumptionAlert}
                        isConsumptionAlertsLoading={mockIsConsumptionAlertsLoading}
                        isSavingAlertLoading={mockIsSavingAlertLoading}
                    />
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

            expect(() => getByText(BUTTON_ENREGISTRER)).toBeTruthy()
            expect(() => getByText(BUTTON_ANNULER)).toBeTruthy()

            // both inputs are enabled
            const textFieldMuiElementsAfterEnable = container.getElementsByClassName(MUI_DISABLED)
            expect(textFieldMuiElementsAfterEnable.length).toBe(0)
        }, 2000)
    })
    describe('Test form manipulation.', () => {
        test('When tayping consumption value of price changes based on price per kwh.', () => {
            const { getByText, container } = reduxedRender(
                <BrowserRouter>
                    <ConsumptionAlert
                        interval="day"
                        initialValues={mockInitialValue}
                        pricePerKwh={PRICE_PER_KWH}
                        saveConsumptionAlert={mockSaveConsumptionAlert}
                        isConsumptionAlertsLoading={mockIsConsumptionAlertsLoading}
                        isSavingAlertLoading={mockIsSavingAlertLoading}
                    />
                </BrowserRouter>,
            )

            // enable form
            userEvent.click(getByText(BUTTON_MODIFIER))

            // two inputs
            const textFieldMuiElements = container.getElementsByClassName(MUI_TEXTFIELD)
            const testConsumption = 20

            userEvent.type(textFieldMuiElements[0], `${testConsumption}`)
            expect(textFieldMuiElements[0]).toHaveValue(testConsumption)
            expect(textFieldMuiElements[1]).toHaveValue(testConsumption * PRICE_PER_KWH)

            // then try to delete what we were writing
            userEvent.type(textFieldMuiElements[0], '{Delete}')
            expect(textFieldMuiElements[0]).toHaveValue(null)
            expect(textFieldMuiElements[1]).toHaveValue(null)
        })
        test('When tayping price value of consumption changes based on price per kwh.', () => {
            const { getByText, container } = reduxedRender(
                <BrowserRouter>
                    <ConsumptionAlert
                        interval="day"
                        initialValues={mockInitialValue}
                        pricePerKwh={PRICE_PER_KWH}
                        saveConsumptionAlert={mockSaveConsumptionAlert}
                        isConsumptionAlertsLoading={mockIsConsumptionAlertsLoading}
                        isSavingAlertLoading={mockIsSavingAlertLoading}
                    />
                </BrowserRouter>,
            )

            // enable form
            userEvent.click(getByText(BUTTON_MODIFIER))

            // two inputs
            const textFieldMuiElements = container.getElementsByClassName(MUI_TEXTFIELD)
            const testPrice = 20

            userEvent.type(textFieldMuiElements[1], `${testPrice}`)
            expect(textFieldMuiElements[1]).toHaveValue(testPrice)
            expect(textFieldMuiElements[0]).toHaveValue(parseFloat((testPrice / PRICE_PER_KWH).toFixed(5)))

            // then try to delete what we were writing
            userEvent.type(textFieldMuiElements[1], '{Delete}')
            expect(textFieldMuiElements[1]).toHaveValue(null)
            expect(textFieldMuiElements[0]).toHaveValue(null)
        })
        test('When tayping values and cancel, initial values should appear.', () => {
            const { getByText, container } = reduxedRender(
                <BrowserRouter>
                    <ConsumptionAlert
                        interval="day"
                        initialValues={mockInitialValue}
                        pricePerKwh={PRICE_PER_KWH}
                        saveConsumptionAlert={mockSaveConsumptionAlert}
                        isConsumptionAlertsLoading={mockIsConsumptionAlertsLoading}
                        isSavingAlertLoading={mockIsSavingAlertLoading}
                    />
                </BrowserRouter>,
            )

            // enable form
            userEvent.click(getByText(BUTTON_MODIFIER))

            // two inputs
            const textFieldMuiElements = container.getElementsByClassName(MUI_TEXTFIELD)
            const testPrice = 20

            userEvent.type(textFieldMuiElements[1], `${testPrice}`)
            expect(textFieldMuiElements[1]).toHaveValue(testPrice)
            expect(textFieldMuiElements[0]).toHaveValue(parseFloat((testPrice / PRICE_PER_KWH).toFixed(5)))

            // cancel changes
            userEvent.click(getByText(BUTTON_ANNULER))

            // see if changes were cancel
            expect(textFieldMuiElements[1]).toHaveValue(0)
            expect(textFieldMuiElements[0]).toHaveValue(0)
        })
        test('When tayping values and save, save hooko should be call with correct values and fields disabled.', async () => {
            const { getByText, container } = reduxedRender(
                <BrowserRouter>
                    <ConsumptionAlert
                        interval="day"
                        initialValues={mockInitialValue}
                        pricePerKwh={PRICE_PER_KWH}
                        saveConsumptionAlert={mockSaveConsumptionAlert}
                        isConsumptionAlertsLoading={mockIsConsumptionAlertsLoading}
                        isSavingAlertLoading={mockIsSavingAlertLoading}
                    />
                </BrowserRouter>,
            )

            // enable form
            userEvent.click(getByText(BUTTON_MODIFIER))

            // two inputs
            const textFieldMuiElements = container.getElementsByClassName(MUI_TEXTFIELD)
            const testPrice = 20

            userEvent.type(textFieldMuiElements[1], `${testPrice}`)
            expect(textFieldMuiElements[1]).toHaveValue(testPrice)
            expect(textFieldMuiElements[0]).toHaveValue(parseFloat((testPrice / PRICE_PER_KWH).toFixed(5)))

            // save changes
            userEvent.click(getByText(BUTTON_ENREGISTRER))

            // price was saved by typing in it so the save request must have the price, and consumption to null
            await waitFor(() => {
                expect(mockSaveConsumptionAlert).toHaveBeenCalledWith({ price: testPrice, consumption: null }, 'day')
            })

            // price and consumption should have values registered
            expect(textFieldMuiElements[1]).toHaveValue(testPrice)
            expect(textFieldMuiElements[0]).toHaveValue(parseFloat((testPrice / PRICE_PER_KWH).toFixed(5)))

            // both inputs are disabled
            expect(textFieldMuiElements[0].classList.contains(MUI_DISABLED)).toBeTruthy()
            expect(textFieldMuiElements[1].classList.contains(MUI_DISABLED)).toBeTruthy()

            // try to click again on modify to see if the component take this last values or the first ones ( in the init )
            // ( it should have the last ones of course )
            userEvent.click(getByText(BUTTON_MODIFIER))
            expect(textFieldMuiElements[1]).toHaveValue(testPrice)
            expect(textFieldMuiElements[0]).toHaveValue(parseFloat((testPrice / PRICE_PER_KWH).toFixed(5)))
        })
    })
})
