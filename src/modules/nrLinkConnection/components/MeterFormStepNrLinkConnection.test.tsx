import { reduxedRender } from 'src/common/react-platform-components/test'
import { MeterFormStepNrLinkConnection } from 'src/modules/nrLinkConnection'
import { fireEvent, waitFor } from '@testing-library/react'
import { TEST_ADD_METER, TEST_METERS } from 'src/mocks/handlers/meters'
import userEvent from '@testing-library/user-event'
import { IMeter } from 'src/modules/Meters/Meters'

let mockMeterList: IMeter[] | null = TEST_METERS
const mockAddMeter = jest.fn()
let mockLoadingMeterInProgress = false
const SUBMIT_BUTTON_TEXT = 'Suivant'
const REQUIRED_ERROR_TEXT = 'Champ obligatoire non renseigné'
const CLEAR_AUTOCOMPLETE_ICON_TEST_ID = 'CloseIcon'

const guidQuerySelector = 'input[name="guid"]'
const nameInputLabelText = 'Nom de mon compteur'
const MuiAutoCompletePaperQuerySelector = 'MuiAutocomplete-paper'

/**
 * Mocking props of AddCustomerPopup.
 */
const mockMeterFormStepNrLinkConnectionProps = {
    handleBack: jest.fn(),
    handleNext: jest.fn(),
}

// Mock metersHook
jest.mock('src/modules/Meters/metersHook', () => ({
    ...jest.requireActual('src/modules/Meters/metersHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMeterList: () => ({
        elementList: mockMeterList,
        addElement: mockAddMeter,
        loadingInProgress: mockLoadingMeterInProgress,
    }),
}))

// Test Mui Autocomplete
// https://stackoverflow.com/a/63748008/13145536
/**
 * Function submitWithValidData so that we don't duplicate multiple lines of code, it has the option of .
 *
 * @param getByLabelText Testing function getByLabelText.
 * @param getByText Testing function getByText.
 * @param isMeterList Indicate if meterList is null or empty so that we can test false case.
 * @param container Container Element.
 */
function fillAutoComplete(
    getByLabelText: Function,
    getByText: Function,
    isMeterList: boolean = true,
    container?: HTMLElement,
) {
    // fill out autocomplete
    const meterNameAutoComplete = getByLabelText(nameInputLabelText)
    userEvent.click(meterNameAutoComplete)

    if (isMeterList) {
        // witness autocomplete working
        expect(getByText(TEST_METERS[0].name)).toBeInTheDocument()

        // verify autocomplete items are visible
        expect(getByText(TEST_METERS[1].name)).toBeInTheDocument()

        // click on autocomplete item
        userEvent.click(getByText(TEST_METERS[0].name))

        // verify autocomplete has new value
        expect(meterNameAutoComplete).toHaveValue(TEST_METERS[0].name)
    } else {
        // AutoComplete have Empty options
        expect(container!.querySelector(MuiAutoCompletePaperQuerySelector)?.innerHTML).toBeUndefined()
    }
}

describe('Test MeterFormStepNrLinkConnection', () => {
    describe('form validation', () => {
        test('all fields required required', async () => {
            const { container, getAllByText, getByText, getByLabelText } = reduxedRender(
                <MeterFormStepNrLinkConnection {...mockMeterFormStepNrLinkConnectionProps} />,
            )
            // When name on blur
            userEvent.click(getByLabelText(nameInputLabelText))
            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
            await waitFor(() => {
                expect(getAllByText(REQUIRED_ERROR_TEXT).length).toBe(2)
            })
            // When name and guid are both empty
            userEvent.type(getByLabelText(nameInputLabelText), '')
            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
            await waitFor(() => {
                expect(getAllByText(REQUIRED_ERROR_TEXT).length).toBe(2)
            })
            // When only name is empty
            userEvent.type(container.querySelector(guidQuerySelector)!, '12345123451234')
            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
            await waitFor(() => {
                expect(getAllByText(REQUIRED_ERROR_TEXT).length).toBe(1)
            })
        })
        test('GUID format validation, 14 characters', async () => {
            const { container, getByText } = reduxedRender(
                <MeterFormStepNrLinkConnection {...mockMeterFormStepNrLinkConnectionProps} />,
            )
            fireEvent.input(container.querySelector(guidQuerySelector)!, { target: { value: '123456' } })
            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
            await waitFor(() => {
                expect(getByText('Le champ doit avoir au minimum 14 caractères')).toBeTruthy()
            })
            fireEvent.input(container.querySelector(guidQuerySelector)!, { target: { value: '12345678910111213' } })
            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
            await waitFor(() => {
                expect(getByText('Le champ doit avoir au maximum 14 caractères')).toBeTruthy()
            })
        })

        test('Name Meter AutoComplete required when clearing', async () => {
            const { getByTestId, getByLabelText, getByText, getAllByText } = reduxedRender(
                <MeterFormStepNrLinkConnection {...mockMeterFormStepNrLinkConnectionProps} />,
            )
            fillAutoComplete(getByLabelText, getByText)
            userEvent.click(getByTestId(CLEAR_AUTOCOMPLETE_ICON_TEST_ID))
            expect(getAllByText(REQUIRED_ERROR_TEXT)).toHaveLength(1)
        })
    })
    describe('Submit form', () => {
        test('when addMeter, it should be called, with handleNext', async () => {
            const mockHandleNext = jest.fn()
            mockMeterFormStepNrLinkConnectionProps.handleNext = mockHandleNext
            const { container, getByLabelText, getByText } = reduxedRender(
                <MeterFormStepNrLinkConnection {...mockMeterFormStepNrLinkConnectionProps} />,
            )
            fireEvent.change(container.querySelector(guidQuerySelector)! as HTMLInputElement, {
                target: { value: TEST_ADD_METER.guid },
            })
            expect(container.querySelector(guidQuerySelector)!).toHaveValue(TEST_ADD_METER.guid)
            userEvent.type(getByLabelText(nameInputLabelText), TEST_ADD_METER.name)
            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
            await waitFor(() => {
                expect(mockAddMeter).toHaveBeenCalledWith(TEST_ADD_METER)
            })
            expect(mockHandleNext).toHaveBeenCalled()
        }, 20000)
        test('when isCustomerInProgress loader Button should be loading', async () => {
            mockLoadingMeterInProgress = true
            const { container } = reduxedRender(
                <MeterFormStepNrLinkConnection {...mockMeterFormStepNrLinkConnectionProps} />,
            )
            expect(container.querySelector('.MuiLoadingButton-loadingIndicator')).not.toBeNull()
        })
    })
    describe('test autoComplete Options', () => {
        test('When meterList is null, no options shown', async () => {
            mockMeterList = null
            const { container, getByLabelText, getByText } = reduxedRender(
                <MeterFormStepNrLinkConnection {...mockMeterFormStepNrLinkConnectionProps} />,
            )
            fillAutoComplete(getByLabelText, getByText, false, container)
        })
        test('When meterList is empty', async () => {
            mockMeterList = []
            const { container, getByLabelText, getByText } = reduxedRender(
                <MeterFormStepNrLinkConnection {...mockMeterFormStepNrLinkConnectionProps} />,
            )
            fillAutoComplete(getByLabelText, getByText, false, container)
        })
    })
})
