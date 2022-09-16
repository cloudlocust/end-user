import { reduxedRender } from 'src/common/react-platform-components/test'
import { MeterStepNrLinkConnectionForm } from 'src/modules/nrLinkConnection'
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

const guidMeterInputQuerySelector = 'input[name="guid"]'
const disabledQuerySelector = '.Mui-disabled'
const nameMeterInputLabelText = 'Nommer mon compteur'
const MuiAutoCompletePaperQuerySelector = 'MuiAutocomplete-paper'

/**
 * Mocking props of AddCustomerPopup.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
const mockMeterStepNrLinkConnectionFormProps: {
    // eslint-disable-next-line jsdoc/require-jsdoc
    handleBack: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    handleNext: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    setMeter: React.Dispatch<React.SetStateAction<IMeter | null>>
    // eslint-disable-next-line jsdoc/require-jsdoc
    meter: IMeter | null
} = {
    handleBack: jest.fn(),
    handleNext: jest.fn(),
    setMeter: jest.fn(),
    meter: null,
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
    const meterNameAutoComplete = getByLabelText(nameMeterInputLabelText)
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

describe('Test MeterStepNrLinkConnectionForm', () => {
    describe('form validation', () => {
        test('all fields required required', async () => {
            const { container, getAllByText, getByText, getByLabelText } = reduxedRender(
                <MeterStepNrLinkConnectionForm {...mockMeterStepNrLinkConnectionFormProps} />,
            )
            // When name on blur
            userEvent.click(getByLabelText(nameMeterInputLabelText))
            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
            await waitFor(() => {
                expect(getAllByText(REQUIRED_ERROR_TEXT).length).toBe(2)
            })

            // When name and guid are both empty
            userEvent.type(getByLabelText(nameMeterInputLabelText), '')
            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
            await waitFor(() => {
                expect(getAllByText(REQUIRED_ERROR_TEXT).length).toBe(2)
            })

            //  When only name is empty
            userEvent.type(container.querySelector(guidMeterInputQuerySelector)!, '12345123451234')
            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
            await waitFor(() => {
                expect(getAllByText(REQUIRED_ERROR_TEXT).length).toBe(1)
            })
        }, 20000)
        test('GUID format validation, 14 characters', async () => {
            const { container, getByText } = reduxedRender(
                <MeterStepNrLinkConnectionForm {...mockMeterStepNrLinkConnectionFormProps} />,
            )
            fireEvent.input(container.querySelector(guidMeterInputQuerySelector)!, { target: { value: '123456' } })
            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
            await waitFor(() => {
                expect(getByText('Le champ doit avoir au minimum 14 caractères')).toBeTruthy()
            })
            fireEvent.input(container.querySelector(guidMeterInputQuerySelector)!, {
                target: { value: '12345678910111213' },
            })
            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
            await waitFor(() => {
                expect(getByText('Le champ doit avoir au maximum 14 caractères')).toBeTruthy()
            })
        })

        test('Name Meter AutoComplete required when clearing', async () => {
            const { getByTestId, getByLabelText, getByText, getAllByText } = reduxedRender(
                <MeterStepNrLinkConnectionForm {...mockMeterStepNrLinkConnectionFormProps} />,
            )
            fillAutoComplete(getByLabelText, getByText)
            userEvent.click(getByTestId(CLEAR_AUTOCOMPLETE_ICON_TEST_ID))
            expect(getAllByText(REQUIRED_ERROR_TEXT)).toHaveLength(1)
        })
    })
    describe('test autoComplete Options', () => {
        test('When typing on autoComplete changes the setMeter should be called with null', async () => {
            const mockSetMeter = jest.fn()
            mockMeterStepNrLinkConnectionFormProps.setMeter = mockSetMeter

            const { getByLabelText } = reduxedRender(
                <MeterStepNrLinkConnectionForm {...mockMeterStepNrLinkConnectionFormProps} />,
            )
            userEvent.type(getByLabelText(nameMeterInputLabelText), 'have Van')
            expect(getByLabelText(nameMeterInputLabelText)).toHaveValue('have Van')
            await waitFor(() => {
                expect(mockSetMeter).toHaveBeenCalledWith(null)
            })
        })

        test('When meterList is null, no options shown', async () => {
            mockMeterList = null
            const { container, getByLabelText, getByText } = reduxedRender(
                <MeterStepNrLinkConnectionForm {...mockMeterStepNrLinkConnectionFormProps} />,
            )
            fillAutoComplete(getByLabelText, getByText, false, container)
        })
        test('When meterList is empty', async () => {
            mockMeterList = []
            const { container, getByLabelText, getByText } = reduxedRender(
                <MeterStepNrLinkConnectionForm {...mockMeterStepNrLinkConnectionFormProps} />,
            )
            fillAutoComplete(getByLabelText, getByText, false, container)
        })
        test('when option is selected, setMeter should be called with meter option', async () => {
            mockMeterList = TEST_METERS
            const mockSetMeter = jest.fn()
            mockMeterStepNrLinkConnectionFormProps.setMeter = mockSetMeter
            const { getByText, getByLabelText } = reduxedRender(
                <MeterStepNrLinkConnectionForm {...mockMeterStepNrLinkConnectionFormProps} />,
            )
            // Select the options of TEST_METERS
            fillAutoComplete(getByLabelText, getByText)
            await waitFor(() => {
                expect(mockSetMeter).toHaveBeenCalledWith(TEST_METERS[0])
            })
        }, 10000)
    })
    describe('Submit form', () => {
        test('when addMeter, it should be called, with handleNext', async () => {
            const mockHandleNext = jest.fn()
            mockMeterStepNrLinkConnectionFormProps.handleNext = mockHandleNext
            const { container, getByLabelText, getByText } = reduxedRender(
                <MeterStepNrLinkConnectionForm {...mockMeterStepNrLinkConnectionFormProps} />,
            )
            fireEvent.change(container.querySelector(guidMeterInputQuerySelector)! as HTMLInputElement, {
                target: { value: TEST_ADD_METER.guid },
            })
            expect(container.querySelector(guidMeterInputQuerySelector)!).toHaveValue(TEST_ADD_METER.guid)
            userEvent.type(getByLabelText(nameMeterInputLabelText), TEST_ADD_METER.name)
            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
            await waitFor(() => {
                expect(mockAddMeter).toHaveBeenCalledWith(TEST_ADD_METER)
            })
            expect(mockHandleNext).toHaveBeenCalled()
        }, 20000)
        test('when meter option is selected and submit, guid field is disabled with meterGuid value, handleNext should be called, and addMeter not be called', async () => {
            const mockHandleNext = jest.fn()
            mockMeterStepNrLinkConnectionFormProps.handleNext = mockHandleNext
            mockMeterStepNrLinkConnectionFormProps.meter = TEST_METERS[0]
            const { container, getByText } = reduxedRender(
                <MeterStepNrLinkConnectionForm {...mockMeterStepNrLinkConnectionFormProps} />,
            )
            expect(container.querySelector(guidMeterInputQuerySelector)!).toHaveValue(TEST_METERS[0].guid)
            expect(container.querySelector(disabledQuerySelector)!).toBeInTheDocument()
            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
            await waitFor(() => {
                expect(mockAddMeter).not.toHaveBeenCalled()
            })
            expect(mockHandleNext).toHaveBeenCalled()
        })
        test('when isCustomerInProgress loader Button should be loading', async () => {
            mockLoadingMeterInProgress = true
            const { container } = reduxedRender(
                <MeterStepNrLinkConnectionForm {...mockMeterStepNrLinkConnectionFormProps} />,
            )
            expect(container.querySelector('.MuiLoadingButton-loadingIndicator')).not.toBeNull()
        })
    })
})
