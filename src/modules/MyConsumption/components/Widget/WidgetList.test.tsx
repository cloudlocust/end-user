import { reduxedRender } from 'src/common/react-platform-components/test'
import { WidgetList } from 'src/modules/MyConsumption/components/Widget/WidgetsList'
import { IWidgetListProps } from 'src/modules/MyConsumption/components/Widget/Widget.d'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'

const datapoints = [
    [20, 1640995200000],
    [50, 1641081600000],
    [0, 1641081600000],
]

let mockWidgetProps: IWidgetListProps = {
    data: [
        {
            datapoints,
            target: metricTargetsEnum.consumption,
        },
        {
            datapoints,
            target: metricTargetsEnum.eurosConsumption,
        },
        {
            datapoints,
            target: metricTargetsEnum.internalTemperature,
        },
        {
            datapoints,
            target: metricTargetsEnum.externalTemperature,
        },
        {
            datapoints,
            target: metricTargetsEnum.pMax,
        },
    ],
    isMetricsLoading: false,
    hasMissingHousingContracts: false,
}

const CONSUMPTION_WIDGET_TEXT = 'Consommation Totale'
const CONSUMPTION_EURO_WIDGET_TEXT = 'Coût Total'
const PMAX_WIDGET_TEXT = 'Puissance Maximale'
const EXTERNAL_TEMPERATURE_WIDGET_TEXT = 'Température Extérieure'
const INTERNAL_TEMPERATURE_WIDGET_TEXT = 'Température Intérieure'

describe('WidgetList component test', () => {
    test('when the widget is rendered with different target', async () => {
        const { getByText } = reduxedRender(<WidgetList {...mockWidgetProps} />)

        expect(getByText(CONSUMPTION_WIDGET_TEXT)).toBeInTheDocument()
        expect(getByText(CONSUMPTION_EURO_WIDGET_TEXT)).toBeInTheDocument()
        expect(getByText(PMAX_WIDGET_TEXT)).toBeInTheDocument()
        expect(getByText(EXTERNAL_TEMPERATURE_WIDGET_TEXT)).toBeInTheDocument()
        expect(getByText(INTERNAL_TEMPERATURE_WIDGET_TEXT)).toBeInTheDocument()
    })
})
