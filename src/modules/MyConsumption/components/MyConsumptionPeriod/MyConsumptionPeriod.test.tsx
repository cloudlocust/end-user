import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { dataConsumptionPeriod } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { MyConsumptionPeriod } from 'src/modules/MyConsumption'
import { getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
/*
 * We will test This component if he render and switch content correctly.
 */
const SELECTED_CLASSNAME = 'selected'
let mockSetMetricsInterval = jest.fn()
let mockSetPeriod = jest.fn()
let mockSetRange = jest.fn()
let mockRange = getRange('daily')

describe('load MyConsumptionPeriod', () => {
    test('on success loading the element, MyConsumptionPeriod should be loaded, tabs titles shown', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionPeriod
                    setPeriod={mockSetPeriod}
                    setRange={mockSetRange}
                    period={PeriodEnum.WEEKLY}
                    setMetricsInterval={mockSetMetricsInterval}
                    range={mockRange}
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
        userEvent.click(getByText(dataConsumptionPeriod[0].name))
        await waitFor(() => {
            expect(mockSetPeriod).toHaveBeenCalledWith(dataConsumptionPeriod[0].period)
            expect(mockSetMetricsInterval).toHaveBeenCalledWith(dataConsumptionPeriod[0].interval)
            expect(mockSetRange).toHaveBeenCalledWith(mockRange)
        })
    })
})
