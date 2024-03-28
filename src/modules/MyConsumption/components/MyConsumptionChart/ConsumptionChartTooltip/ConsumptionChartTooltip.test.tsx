import { reduxedRender } from 'src/common/react-platform-components/test'
import { ConsumptionChartTooltip } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartTooltip'
import { EChartTooltipFormatterParamsItem } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartTooltip/ConsumptionChartTooltip.types'

const firstChartTooltipParam: EChartTooltipFormatterParamsItem = {
    name: 'title',
    marker: 'marker 1',
    seriesName: 'Series 1',
    value: 10,
    seriesIndex: 0,
    axisValue: '123456',
    dataIndex: 0,
}

const secondChartTooltipParam: EChartTooltipFormatterParamsItem = {
    name: 'title',
    marker: 'marker 2',
    seriesName: 'Series 2',
    value: 10,
    seriesIndex: 1,
    axisValue: '123456',
    dataIndex: 0,
}

const params = [firstChartTooltipParam, secondChartTooltipParam]
/**
 * Callback function for get total consumption.
 *
 * @returns Total consumption.
 */
const getTotalConsumption = () => ({ value: 30, unit: 'kWh' })
/**
 * Callback function for get total euro cost.
 *
 * @returns Total euro cost.
 */
const getTotalEuroCost = () => ({ value: 50, unit: 'USD' })

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
                getTotalConsumption={getTotalConsumption}
                getTotalEuroCost={getTotalEuroCost}
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
    test('should not show labels if onDisplayTooltipLabel makes theme falsy', () => {
        const { queryByText, getByText } = reduxedRender(
            <ConsumptionChartTooltip
                params={params}
                onDisplayTooltipLabel={(item) => {
                    return item.seriesName === firstChartTooltipParam.seriesName ? false : true
                }}
            />,
        )

        expect(queryByText(firstChartTooltipParam.marker)).not.toBeInTheDocument()
        expect(queryByText(firstChartTooltipParam.seriesName)).not.toBeInTheDocument()

        expect(getByText(secondChartTooltipParam.name)).toBeInTheDocument()
        expect(getByText(secondChartTooltipParam.marker)).toBeInTheDocument()
        expect(getByText(secondChartTooltipParam.seriesName)).toBeInTheDocument()
    })
    test('should the tooltip return custom message component when all labels not showing', () => {
        const message = 'No data to shown'
        const messageComponent = <div className="empty-data">{message}</div>
        const { getByText } = reduxedRender(
            <ConsumptionChartTooltip
                params={params}
                onDisplayTooltipLabel={() => false}
                renderComponentOnMissingLabels={() => messageComponent}
            />,
        )
        expect(getByText(message)).toBeInTheDocument()
        expect(document.querySelector('.empty-data')).toBeInTheDocument()
    })
})
