import React from 'react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { MyConsumptionPeriod } from './MyConsumptionPeriod'
import { dataConsumptionPeriod } from './utils/myConsumptionVariables'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
/*
 * We will test This component if he render and switch content correctly.
 */
const SELECTED_CLASSNAME = 'Mui-selected'
let mockOnHandleMetricsChange = jest.fn()
let mockSetPeriodValue = jest.fn()

describe('load MyConsumptionPeriod', () => {
    test('on success loading the element, MyConsumptionPeriod should be loaded, tabs titles shown', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionPeriod
                    onHandleMetricsChange={mockOnHandleMetricsChange}
                    setPeriodValue={mockSetPeriodValue}
                />
            </Router>,
        )
        // Tabs titles showing.
        expect(getByText(dataConsumptionPeriod[0].name)).toBeTruthy()
        expect(getByText(dataConsumptionPeriod[1].name)).toBeTruthy()
        expect(getByText(dataConsumptionPeriod[2].name)).toBeTruthy()
        expect(getByText(dataConsumptionPeriod[3].name)).toBeTruthy()
        userEvent.click(getByText(dataConsumptionPeriod[1].name))
        expect(getByText(dataConsumptionPeriod[1].name).classList.contains(SELECTED_CLASSNAME)).toBeTruthy()
        expect(getByText(dataConsumptionPeriod[2].name).classList.contains(SELECTED_CLASSNAME)).toBeFalsy()
        await waitFor(() => {
            expect(mockOnHandleMetricsChange).toHaveBeenCalledWith(
                dataConsumptionPeriod[1].interval,
                dataConsumptionPeriod[1].range,
            )
            expect(mockSetPeriodValue).toHaveBeenCalledWith(dataConsumptionPeriod[1].period)
        })
    })
})
