import { reduxedRender } from 'src/common/react-platform-components/test'
import { ConsumptionChartTooltip } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartTooltip'

const firstChartTooltipParam = {
    name: 'title',
    marker: 'marker 1',
    seriesName: 'Series 1',
    value: 10,
    seriesIndex: 0,
}

const secondChartTooltipParam = {
    name: 'title',
    marker: 'marker 2',
    seriesName: 'Series 2',
    value: 10,
    seriesIndex: 1,
}

const params = [firstChartTooltipParam, secondChartTooltipParam]
const totalConsumption = { value: 30, unit: 'kWh' }
const totalEuroCost = { value: 50, unit: 'USD' }

const firstChartformatedValue = `${firstChartTooltipParam.value} kWh`
const secondChartformatedValue = `${firstChartTooltipParam.value} W`

/**
 * Value formatter used for format a value of tooltip.
 *
 * @param index The index of chart.
 * @returns Callback function for format the value by its chart index.
 */
const valueFormatter = (index: number) => () => [firstChartformatedValue, secondChartformatedValue][index]

describe('ConsumptionChartTooltip', () => {
    test('renders the component with correct data', () => {
        const { getByText } = reduxedRender(
            <ConsumptionChartTooltip
                params={params}
                totalConsumption={totalConsumption}
                totalEuroCost={totalEuroCost}
                valueFormatter={valueFormatter}
            />,
        )
        params.forEach((param) => {
            expect(getByText(param.name)).toBeInTheDocument()
            expect(getByText(param.marker)).toBeInTheDocument()
            expect(getByText(param.seriesName)).toBeInTheDocument()
        })
        expect(getByText(firstChartformatedValue)).toBeInTheDocument()
        expect(getByText(secondChartformatedValue)).toBeInTheDocument()

        expect(getByText('30 kWh')).toBeInTheDocument()
        expect(getByText('50 USD')).toBeInTheDocument()
    })

    test('does not render consumption summary if totalConsumption and totalEuroCost are not provided', () => {
        const { queryByText } = reduxedRender(
            <ConsumptionChartTooltip params={params} valueFormatter={valueFormatter} />,
        )
        expect(queryByText('30 kWh')).toBeNull()
        expect(queryByText('50 USD')).toBeNull()
    })
})
