import { reduxedRender } from 'src/common/react-platform-components/test'
import { MeterStepNrLinkConnectionForm } from 'src/modules/nrLinkConnection'
import { fireEvent, waitFor } from '@testing-library/react'
import { TEST_ADD_METER, TEST_METERS } from 'src/mocks/handlers/meters'
import userEvent from '@testing-library/user-event'
import { IMeter } from 'src/modules/Meters/Meters'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { applyCamelCase } from 'src/common/react-platform-components/utils/mm'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'

const TEST_MOCKED_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

const mockAddMeter = jest.fn()
let mockLoadingMeterInProgress = false
const SUBMIT_BUTTON_TEXT = 'Suivant'
const REQUIRED_ERROR_TEXT = 'Champ obligatoire non renseigné'

const guidMeterInputQuerySelector = 'input[name="guid"]'
const nameMeterInputQuerySelector = 'input[name="name"]'
const disabledQuerySelector = '.Mui-disabled'
const nameMeterInputLabelText = 'Nom de mon compteur'

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
    // eslint-disable-next-line jsdoc/require-jsdoc
    housingId: number | undefined
} = {
    handleBack: jest.fn(),
    handleNext: jest.fn(),
    setMeter: jest.fn(),
    meter: null,
    housingId: TEST_MOCKED_HOUSES[1].id,
}

// Mock metersHook
jest.mock('src/modules/Meters/metersHook', () => ({
    ...jest.requireActual('src/modules/Meters/metersHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMeterForHousing: () => ({
        addMeter: mockAddMeter,
        loadingInProgress: mockLoadingMeterInProgress,
    }),
}))

describe('Test MeterStepNrLinkConnectionForm', () => {
    describe('form validation', () => {
        test('all fields required required', async () => {
            const { container, getAllByText, getByText } = reduxedRender(
                <MeterStepNrLinkConnectionForm {...mockMeterStepNrLinkConnectionFormProps} />,
            )
            // When name on blur
            userEvent.click(getByText(nameMeterInputLabelText))
            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
            await waitFor(() => {
                expect(getAllByText(REQUIRED_ERROR_TEXT).length).toBe(2)
            })

            // When name and guid are both empty
            userEvent.type(getByText(nameMeterInputLabelText), '')
            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
            await waitFor(() => {
                expect(getAllByText(REQUIRED_ERROR_TEXT).length).toBe(2)
            })

            // //  When only name is empty
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
    })
    describe('Submit form', () => {
        test('when addMeter, it should be called, with handleNext', async () => {
            const mockHandleNext = jest.fn()
            mockMeterStepNrLinkConnectionFormProps.handleNext = mockHandleNext
            const { container, getByText } = reduxedRender(
                <MeterStepNrLinkConnectionForm {...mockMeterStepNrLinkConnectionFormProps} />,
            )

            fireEvent.change(container.querySelector(guidMeterInputQuerySelector)! as HTMLInputElement, {
                target: { value: TEST_ADD_METER.guid },
            })
            fireEvent.change(container.querySelector(nameMeterInputQuerySelector)! as HTMLInputElement, {
                target: { value: TEST_ADD_METER.name },
            })

            expect(container.querySelector(guidMeterInputQuerySelector)!).toHaveValue(TEST_ADD_METER.guid)
            expect(container.querySelector(nameMeterInputQuerySelector)!).toHaveValue(TEST_ADD_METER.name)

            userEvent.click(getByText(SUBMIT_BUTTON_TEXT))

            await waitFor(() => {
                expect(mockAddMeter).toHaveBeenCalledWith(
                    mockMeterStepNrLinkConnectionFormProps.housingId,
                    TEST_ADD_METER,
                )
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
