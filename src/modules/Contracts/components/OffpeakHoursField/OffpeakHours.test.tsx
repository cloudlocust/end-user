import { reduxedRender } from 'src/common/react-platform-components/test'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { offpeakHoursFieldProps } from 'src/modules/Contracts/contractsTypes'
import { applyCamelCase, Form } from 'src/common/react-platform-components'
import { TEST_HOUSES as MOCK_HOUSES } from 'src/mocks/handlers/houses'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { BrowserRouter as Router } from 'react-router-dom'
import OffPeakHoursField from 'src/modules/Contracts/components/OffpeakHoursField'
import { IMeterFeatures } from 'src/modules/Meters/Meters'
import { TimePickerProps } from '@mui/x-date-pickers/TimePicker'
import dayjs from 'dayjs'

const TEST_HOUSES: IHousing[] = applyCamelCase(MOCK_HOUSES)
let mockIsHousingMeterLoading = false

const SUBMIT_BUTTON_TEXT = 'SUBMIT'
const START_OFFPEAK_HOUR_TEXT = 'Début'
const REQUIRED_FIELD_TEXT = 'Champ Obligatoire non renseigné'
const END_OFFPEAK_HOUR_TEXT = 'Fin'
const TIMEPICKER_DISABLED_TEXT = 'Disabled'
const ADD_OFFPEAK_ICON_DATA_TESTID = 'AddCircleOutlineIcon'
const circularProgressClassname = '.MuiCircularProgress-root'
let mockHousingMeter = TEST_HOUSES[0].meter
const mockHandleSubmit = jest.fn()
const OFFPEAK_HOURS_NAME = 'offpeakHours'
const OFFPEAK_HOURS_LABEL = 'OFFPEAK Hours'

const mockHouseId = TEST_HOUSES[0].id

/**
 * Mocking the react-router-dom used in contractsHooks.
 */
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    /**
     * Mock the useParams to get the houseId from url.
     *
     * @returns UseParams containing houseId.
     */
    useParams: () => ({
        houseId: `${mockHouseId}`,
    }),
}))

/**
 * Mock for offpeakHoursFieldProps.
 */
const mockOffpeakHoursProps: offpeakHoursFieldProps = {
    name: OFFPEAK_HOURS_NAME,
    label: OFFPEAK_HOURS_LABEL,
}

/**
 * Mocking the TimePicker for testing submit.
 *
 * @param props Mui TimePicker props.
 * @returns TimePicker mock.
 */
const MockTimePicker = (props: TimePickerProps) => (
    <div>
        <button
            onClick={() => {
                if ((props.label as string).includes(START_OFFPEAK_HOUR_TEXT)) props.onChange(dayjs().startOf('day'))
                else props.onChange(dayjs().startOf('day').add(8, 'hours'))
            }}
        >
            {props.label}
        </button>
        {props.value && <p>{dayjs(props.value as Date).format('HH:mm')}</p>}
        {props.disabled && <p>{TIMEPICKER_DISABLED_TEXT}</p>}
    </div>
)

/**
 * Mocking the TimePicker for testing purposes.
 */
jest.mock('@mui/x-date-pickers/TimePicker', () => ({
    ...jest.requireActual('@mui/x-date-pickers/TimePicker'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    TimePicker: (props: TimePickerProps) => <MockTimePicker {...props} />,
}))

/**
 * Mocking the useHousingMeterDetails.
 */
jest.mock('src/modules/Meters/metersHook', () => ({
    ...jest.requireActual('src/modules/Meters/metersHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHousingMeterDetails: () => ({
        loadingInProgress: mockIsHousingMeterLoading,
        elementDetails: mockHousingMeter,
    }),
}))

describe('Test OffPeakHours Component', () => {
    test('When filling offHourPeakHour, value should be shown and valid data sent when submitting', async () => {
        const TEST_OFFPEAK_HOURS = { start: '00:00', end: '08:00' }
        const TEST_VALID_DATA: IMeterFeatures = {
            offpeak: {
                offpeakHours: [TEST_OFFPEAK_HOURS],
                readOnly: false,
            },
        }
        const { getByText } = reduxedRender(
            <Router>
                <Form onSubmit={(data) => mockHandleSubmit(data)}>
                    <OffPeakHoursField {...mockOffpeakHoursProps} />
                    <button type="submit">{SUBMIT_BUTTON_TEXT}</button>
                </Form>
            </Router>,
        )

        // Filling Start OffpeakHour
        userEvent.click(getByText(START_OFFPEAK_HOUR_TEXT))
        await waitFor(() => {
            expect(getByText(TEST_OFFPEAK_HOURS.start)).toBeTruthy()
        })

        // Filling End OffpeakHour TimePicker
        userEvent.click(getByText(END_OFFPEAK_HOUR_TEXT))
        await waitFor(() => {
            expect(getByText(TEST_OFFPEAK_HOURS.end)).toBeTruthy()
        })

        userEvent.click(getByText(SUBMIT_BUTTON_TEXT))

        await waitFor(() => {
            expect(mockHandleSubmit).toHaveBeenCalledWith({ [OFFPEAK_HOURS_NAME]: TEST_VALID_DATA })
        })
    }, 8000)

    test('When mounting offPeakHours should show initialValues, and when submitting validation is shown', async () => {
        const { getByText, getAllByText } = reduxedRender(
            <Router>
                <Form onSubmit={mockHandleSubmit}>
                    <OffPeakHoursField {...mockOffpeakHoursProps} />
                    <button type="submit">{SUBMIT_BUTTON_TEXT}</button>
                </Form>
            </Router>,
        )

        expect(getByText(OFFPEAK_HOURS_LABEL)).toBeTruthy()
        expect(getAllByText(START_OFFPEAK_HOUR_TEXT)).toHaveLength(1)
        expect(getAllByText(END_OFFPEAK_HOUR_TEXT)).toHaveLength(1)

        userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
        await waitFor(() => {
            expect(getByText(REQUIRED_FIELD_TEXT)).toBeTruthy()
        })
        expect(mockHandleSubmit).not.toHaveBeenCalled()
    })

    test('When adding offHourPeakHour, entry should be shown and button is not shown', async () => {
        const { getByText, getAllByText, getByTestId } = reduxedRender(
            <Router>
                <Form onSubmit={mockHandleSubmit}>
                    <OffPeakHoursField {...mockOffpeakHoursProps} />
                    <button type="submit">{SUBMIT_BUTTON_TEXT}</button>
                </Form>
            </Router>,
        )

        expect(getByText(OFFPEAK_HOURS_LABEL)).toBeTruthy()
        expect(getAllByText(START_OFFPEAK_HOUR_TEXT)).toHaveLength(1)
        expect(getAllByText(END_OFFPEAK_HOUR_TEXT)).toHaveLength(1)

        userEvent.click(getByTestId(ADD_OFFPEAK_ICON_DATA_TESTID))
        await waitFor(() => {
            expect(getAllByText(START_OFFPEAK_HOUR_TEXT)).toHaveLength(2)
        })
        expect(getAllByText(END_OFFPEAK_HOUR_TEXT)).toHaveLength(2)
        expect(() => getByTestId(ADD_OFFPEAK_ICON_DATA_TESTID)).toThrow()
    })

    test('When housingMeter is loading, spinner should be shown', async () => {
        mockIsHousingMeterLoading = true
        const { getByText, container } = reduxedRender(
            <Router>
                <Form onSubmit={mockHandleSubmit}>
                    <OffPeakHoursField {...mockOffpeakHoursProps} />
                    <button type="submit">{SUBMIT_BUTTON_TEXT}</button>
                </Form>
            </Router>,
        )

        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()

        expect(() => getByText(OFFPEAK_HOURS_LABEL)).toThrow()
        expect(() => getByText(START_OFFPEAK_HOUR_TEXT)).toThrow()
        expect(() => getByText(END_OFFPEAK_HOUR_TEXT)).toThrow()
    })
    test('When meter is null component is not shown', async () => {
        mockHousingMeter = null
        const { getByText } = reduxedRender(
            <Router>
                <Form onSubmit={mockHandleSubmit}>
                    <OffPeakHoursField {...mockOffpeakHoursProps} />
                    <button type="submit">{SUBMIT_BUTTON_TEXT}</button>
                </Form>
            </Router>,
        )

        expect(() => getByText(OFFPEAK_HOURS_LABEL)).toThrow()
        expect(() => getByText(START_OFFPEAK_HOUR_TEXT)).toThrow()
        expect(() => getByText(END_OFFPEAK_HOUR_TEXT)).toThrow()
    })
})
