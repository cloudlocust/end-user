import React from 'react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import format from 'date-fns/format'
import { getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import MyConsumptionDatePicker from 'src/modules/MyConsumption/components/MyConsumptionDatePicker'

let mockSetRange = jest.fn()
let mockPeriod = 'daily'
const dateFormat = 'dd/MM/yyyy'
const buttonLeft = 'chevron_left'
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
        userEvent.click(getByText(buttonLeft))
        expect(container.querySelector('input')?.value).toBe(format(new Date(yesterday), dateFormat))
    })
    test('when the user clicks on the left arrow, the previous week is shown', async () => {
        mockPeriod = 'weekly'
        const dateWeek = new Date()
        const prevWeek = dateWeek.setDate(dateWeek.getDate() - 6)
        mockRange = getRange(mockPeriod, new Date(prevWeek), 'sub')
        const { getByText, container } = reduxedRender(
            <Router>
                <MyConsumptionDatePicker period={mockPeriod} setRange={mockSetRange} range={mockRange} />
            </Router>,
        )
        userEvent.click(getByText(buttonLeft))
        expect(container.querySelector('input')?.value).toBe(format(new Date(prevWeek), dateFormat))
    })
    test('when the user clicks on the left arrow, the previous month is shown', async () => {
        mockPeriod = 'monthly'
        const dateMonth = new Date()
        const prevMonth = dateMonth.setMonth(dateMonth.getMonth() - 1)
        mockRange = getRange(mockPeriod, new Date(prevMonth), 'sub')
        const { getByText, container } = reduxedRender(
            <Router>
                <MyConsumptionDatePicker period={mockPeriod} setRange={mockSetRange} range={mockRange} />
            </Router>,
        )
        userEvent.click(getByText(buttonLeft))
        expect(container.querySelector('input')?.value).toBe(format(new Date(prevMonth), 'MM/yyyy'))
    })
    test('when the user clicks on the left arrow, the previous year is shown', async () => {
        mockPeriod = 'yearly'
        const dateYear = new Date()
        const prevYear = dateYear.setFullYear(dateYear.getFullYear() - 1)
        mockRange = getRange(mockPeriod, new Date(prevYear), 'sub')
        const { getByText, container } = reduxedRender(
            <Router>
                <MyConsumptionDatePicker period={mockPeriod} setRange={mockSetRange} range={mockRange} />
            </Router>,
        )
        userEvent.click(getByText(buttonLeft))
        expect(container.querySelector('input')?.value).toBe(format(new Date(prevYear), 'yyyy'))
    })
    test('when the user clicks on the right arrow, the next year is shown', async () => {
        mockPeriod = 'yearly'
        const dateYear = new Date('2019')
        const nextYear = dateYear.setFullYear(dateYear.getFullYear() + 1)
        mockRange = getRange(mockPeriod, new Date(nextYear), 'sub')
        const { getByText, container } = reduxedRender(
            <Router>
                <MyConsumptionDatePicker period={mockPeriod} setRange={mockSetRange} range={mockRange} />
            </Router>,
        )
        userEvent.click(getByText('chevron_right'))
        expect(container.querySelector('input')?.value).toBe(format(new Date(nextYear), 'yyyy'))
    })
})
