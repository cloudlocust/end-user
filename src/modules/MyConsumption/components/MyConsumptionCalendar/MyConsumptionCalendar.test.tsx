import React from 'react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import format from 'date-fns/format'
import { MyConsumptionCalendar } from 'src/modules/MyConsumption'

let mockSetRange = jest.fn()
let mockPeriod = 'daily'
const dateFormat = 'dd/MM/yyyy'
const buttonLeft = 'chevron_left'
const date = new Date()
describe('Load MyConsumptionCalendar', () => {
    test('when the user clicks on the left arrow, yesterday`s date is shown', async () => {
        const { getByText, container } = reduxedRender(
            <Router>
                <MyConsumptionCalendar period={mockPeriod} setRange={mockSetRange} />
            </Router>,
        )
        expect(container.querySelector('input')?.value).toBe(format(date, dateFormat))
        userEvent.click(getByText(buttonLeft))
        const yesterday = date.setDate(date.getDate() - 1)
        expect(container.querySelector('input')?.value).toBe(format(new Date(yesterday), dateFormat))
    })
    test('when the user clicks on the left arrow, the last week is shown', async () => {
        mockPeriod = 'weekly'
        const { getByText, container } = reduxedRender(
            <Router>
                <MyConsumptionCalendar period={mockPeriod} setRange={mockSetRange} />
            </Router>,
        )
        const date = new Date()
        userEvent.click(getByText(buttonLeft))
        const prevWeek = date.setDate(date.getDate() - 7)
        expect(container.querySelector('input')?.value).toBe(format(new Date(prevWeek), dateFormat))
    })
    test('when the user clicks on the left arrow, the last month is shown', async () => {
        mockPeriod = 'monthly'
        const { getByText, container } = reduxedRender(
            <Router>
                <MyConsumptionCalendar period={mockPeriod} setRange={mockSetRange} />
            </Router>,
        )
        userEvent.click(getByText(buttonLeft))
        const prevMonth = date.setMonth(date.getMonth() - 1)
        expect(container.querySelector('input')?.value).toBe(format(new Date(prevMonth), 'MM/yyyy'))
    })
    test('when the user clicks on the left arrow, the last year is shown', async () => {
        mockPeriod = 'yearly'
        const { getByText, container } = reduxedRender(
            <Router>
                <MyConsumptionCalendar period={mockPeriod} setRange={mockSetRange} />
            </Router>,
        )
        userEvent.click(getByText(buttonLeft))
        const prevYear = date.setFullYear(date.getFullYear() - 1)
        expect(container.querySelector('input')?.value).toBe(format(new Date(prevYear), 'yyyy'))
        userEvent.click(getByText(buttonLeft))
        userEvent.click(getByText('chevron_right'))
        expect(container.querySelector('input')?.value).toBe(format(new Date(prevYear), 'yyyy'))
    })
})
