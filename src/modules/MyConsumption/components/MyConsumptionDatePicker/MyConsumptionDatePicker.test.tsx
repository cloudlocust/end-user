import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import format from 'date-fns/format'
import { addPeriod, getRange, subPeriod } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import MyConsumptionDatePicker from 'src/modules/MyConsumption/components/MyConsumptionDatePicker'
import { waitFor } from '@testing-library/react'
import dayjs from 'dayjs'
import { startOfDay, subMonths } from 'date-fns'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'

let mockSetRange = jest.fn()
let mockOnDatePickerChange = jest.fn()
const INCREMENT_DATE_ARROW_TEXT = 'chevron_right'
const DECREMENT_DATE_ARROW_TEXT = 'chevron_left'
const disabledClass = 'Mui-disabled'
const CONFIRM_DATE_PICKER_TEXT = 'OK'
let mockPeriod = PeriodEnum.DAILY
const dateFormat = 'dd/MM/yyyy'
const date = new Date()
const yesterday = date.setDate(date.getDate() - 1)
let mockRange = getRange(mockPeriod, new Date(yesterday), 'sub')
describe('Load MyConsumptionDatePicker', () => {
    test('when the user clicks on the left arrow, yesterday`s date is shown', async () => {
        const { getByText, container } = reduxedRender(
            <Router>
                <MyConsumptionDatePicker period={mockPeriod} setRange={mockSetRange} range={mockRange} />
            </Router>,
        )
        expect(container.querySelector('input')?.value).toBe(format(date, dateFormat))
        userEvent.click(getByText(DECREMENT_DATE_ARROW_TEXT))
        expect(container.querySelector('input')?.value).toBe(format(new Date(yesterday), dateFormat))
    })
    test('when the user clicks on the left arrow, the previous week is shown', async () => {
        mockPeriod = PeriodEnum.WEEKLY
        const dateWeek = new Date()
        const prevWeek = dateWeek.setDate(dateWeek.getDate() - 6)
        mockRange = getRange(mockPeriod, new Date(dateWeek), 'add')
        const { getByText, container } = reduxedRender(
            <Router>
                <MyConsumptionDatePicker period={mockPeriod} setRange={mockSetRange} range={mockRange} />
            </Router>,
        )
        userEvent.click(getByText(DECREMENT_DATE_ARROW_TEXT))
        expect(container.querySelector('input')?.value).toBe(format(new Date(prevWeek), dateFormat))
    })
    test('when the user clicks on the left arrow, the previous month is shown', async () => {
        mockPeriod = PeriodEnum.MONTHLY
        const dateMonth = startOfDay(new Date())
        const prevMonthDate = subMonths(dateMonth, 1)
        mockRange = getRange(mockPeriod, prevMonthDate, 'add')
        const { getByText, container } = reduxedRender(
            <Router>
                <MyConsumptionDatePicker period={mockPeriod} setRange={mockSetRange} range={mockRange} />
            </Router>,
        )
        userEvent.click(getByText(DECREMENT_DATE_ARROW_TEXT))
        expect(container.querySelector('input')?.value).toBe(format(prevMonthDate, 'MM/yyyy'))
    })
    test('when the user clicks on the left arrow, the previous year is shown', async () => {
        mockPeriod = PeriodEnum.YEARLY
        const dateYear = new Date()
        const prevYear = dateYear.setFullYear(dateYear.getFullYear() - 1)
        mockRange = getRange(mockPeriod, new Date(prevYear), 'add')
        const { getByText, container } = reduxedRender(
            <Router>
                <MyConsumptionDatePicker period={mockPeriod} setRange={mockSetRange} range={mockRange} />
            </Router>,
        )
        userEvent.click(getByText(DECREMENT_DATE_ARROW_TEXT))
        expect(container.querySelector('input')?.value).toBe(format(new Date(prevYear), 'yyyy'))
    })
    test('when the user clicks on the right arrow, the end of year is shown', async () => {
        mockPeriod = PeriodEnum.YEARLY
        const dateYear = new Date('2019')
        const nextYear = dateYear.setFullYear(dateYear.getFullYear() + 1)
        const endYear = '2020-12-31T23:59:59.999Z'
        const startYear = '2020-01-01T00:00:00.000Z'
        mockSetRange = jest.fn()
        mockRange = getRange(mockPeriod, new Date(nextYear), 'sub')
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionDatePicker period={mockPeriod} setRange={mockSetRange} range={mockRange} />
            </Router>,
        )
        userEvent.click(getByText(INCREMENT_DATE_ARROW_TEXT))
        const expectedRange = {
            from: startYear,
            to: endYear,
        }
        await waitFor(() => {
            expect(mockSetRange).toHaveBeenCalledWith(expectedRange)
        })
    }, 30000)

    test('When onDatePickerChange is given, it should be called with the right data when previous or next', async () => {
        jest.useFakeTimers() // Enable fake timers

        mockPeriod = PeriodEnum.YEARLY
        const date = new Date('2022-01-01 00:00:00:000')
        mockRange = getRange(mockPeriod, date, 'sub')
        const { getByText, container } = reduxedRender(
            <Router>
                <MyConsumptionDatePicker
                    period={mockPeriod}
                    setRange={mockSetRange}
                    range={mockRange}
                    onDatePickerChange={mockOnDatePickerChange}
                />
            </Router>,
        )

        // INCREMENT DATE BUTTON
        userEvent.click(getByText(INCREMENT_DATE_ARROW_TEXT))
        jest.runAllTimers() // Run all pending timers

        // Wait for the handler to be called
        await waitFor(() => {
            expect(mockOnDatePickerChange).toHaveBeenCalledWith(addPeriod(new Date(mockRange.to), 'years'))
        })

        // DECREMENT DATE BUTTON
        userEvent.click(getByText(DECREMENT_DATE_ARROW_TEXT))
        jest.advanceTimersByTime(1500)

        // Wait for the timeout to finish
        await waitFor(() => {
            expect(mockOnDatePickerChange).toHaveBeenCalledWith(subPeriod(new Date(mockRange.from), 'years'))
        })

        // SELECTING DATE IN DATE PICKER
        // Opening the DatePicker
        userEvent.click(container.querySelector('input')!)

        // Selecting a year
        const selectedYear = '2009'
        userEvent.click(getByText(selectedYear)!)
        userEvent.click(getByText(CONFIRM_DATE_PICKER_TEXT)!)
        await waitFor(() => {
            expect(() => getByText(selectedYear)!).toThrow()
        })
        expect(mockOnDatePickerChange).toHaveBeenLastCalledWith(dayjs('2009-01-01').utc().toDate())

        jest.useRealTimers() // Restore real timers
    }, 20000)

    test('When Selecting a date in the datePicker, it should represents the range.from', async () => {
        mockPeriod = PeriodEnum.YEARLY
        const date = new Date('2018-01-01 00:00:00:000')
        mockRange = getRange(mockPeriod, date, 'add')
        mockSetRange = jest.fn()
        const { getByText, container } = reduxedRender(
            <Router>
                <MyConsumptionDatePicker period={mockPeriod} setRange={mockSetRange} range={mockRange} />
            </Router>,
        )

        // SELECTING DATE IN DATE PICKER
        // Opening the DatePicker
        userEvent.click(container.querySelector('input')!)

        // Selecting a year
        const selectedYear = '2009'
        userEvent.click(getByText(selectedYear)!)
        userEvent.click(getByText(CONFIRM_DATE_PICKER_TEXT)!)
        await waitFor(() => {
            expect(() => getByText(selectedYear)!).toThrow()
        })
        expect(mockSetRange).toHaveBeenLastCalledWith({
            from: '2009-01-01T00:00:00.000Z',
            to: expect.anything(),
        })
    }, 20000)
    test('When maxDate given, disabled should be shown on increment date arrow when date is max', async () => {
        mockPeriod = PeriodEnum.YEARLY
        const maxDate = new Date('2010-01-01 00:00:00:000')
        const date = new Date('2022-01-01 00:00:00:000')
        mockRange = getRange(mockPeriod, date, 'sub')
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionDatePicker
                    period={mockPeriod}
                    setRange={mockSetRange}
                    range={mockRange}
                    maxDate={maxDate}
                />
            </Router>,
        )

        // Button Icon Increment
        expect(getByText(INCREMENT_DATE_ARROW_TEXT)!.parentElement!.classList.contains(disabledClass)).toBeTruthy()
    })

    test('When isPreviousButtonDisabling given as true, the previous button should be disabled', async () => {
        mockPeriod = PeriodEnum.YEARLY
        const maxDate = new Date('2010-01-01 00:00:00:000')
        const date = new Date('2023-01-01 00:00:00:000')
        mockRange = getRange(mockPeriod, date, 'sub')
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionDatePicker
                    period={mockPeriod}
                    setRange={mockSetRange}
                    range={mockRange}
                    maxDate={maxDate}
                    isPreviousButtonDisabling={true}
                />
            </Router>,
        )

        expect(getByText(DECREMENT_DATE_ARROW_TEXT)!.parentElement!.classList.contains(disabledClass)).toBeTruthy()
    })

    test('Should disable only the years 2008 and 2010', async () => {
        // mockPeriod = PeriodEnum.YEARLY
        // const maxDate = new Date('2005-01-01 00:00:00:000')
        // const date = new Date('2024-01-01 00:00:00:000')
        // mockRange = getRange(mockPeriod, date, 'sub')

        mockPeriod = PeriodEnum.YEARLY
        const date = new Date('2019-01-01 00:00:00:000')
        mockRange = getRange(mockPeriod, date, 'add')
        mockSetRange = jest.fn()
        const { container, getByText } = reduxedRender(
            <Router>
                <MyConsumptionDatePicker
                    period={mockPeriod}
                    setRange={mockSetRange}
                    range={mockRange}
                    handleYears={(date: Date) => [2008, 2010].includes(date.getFullYear())}
                />
            </Router>,
        )

        userEvent.click(container.querySelector('input')!)
        expect(getByText('2008')).toBeDisabled()
        expect(getByText('2009')).not.toBeDisabled()
        expect(getByText('2010')).toBeDisabled()
    })
})
