import React from 'react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { dataConsumptionPeriod } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { MyConsumptionPeriod } from 'src/modules/MyConsumption'
/*
 * We will test This component if he render and switch content correctly.
 */
const SELECTED_CLASSNAME = 'Mui-selected'
let mockSetMetricsInterval = jest.fn()
let mockSetPeriod = jest.fn()
let mockSetRange = jest.fn()

describe('load MyConsumptionPeriod', () => {
    test('on success loading the element, MyConsumptionPeriod should be loaded, tabs titles shown', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionPeriod
                    setPeriod={mockSetPeriod}
                    setRange={mockSetRange}
                    setMetricsInterval={mockSetMetricsInterval}
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
            expect(mockSetPeriod).toHaveBeenCalledWith(dataConsumptionPeriod[1].period)
            expect(mockSetMetricsInterval).toHaveBeenCalledWith(dataConsumptionPeriod[1].interval)
            expect(mockSetRange).toHaveBeenCalledWith(dataConsumptionPeriod[1].range)
        })
    })
})
