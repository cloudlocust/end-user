import { reduxedRender } from 'src/common/react-platform-components/test'
import { Widget } from 'src/modules/MyConsumption'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widgets/Widget'
import { TEST_SUCCESS_WEEK_METRICS } from 'src/mocks/handlers/metrics'

const mockWidgetProps: IWidgetProps = {
    type: 'consumption_metrics',
    data: TEST_SUCCESS_WEEK_METRICS,
    isMetricsLoading: false,
}

const CONSOMMATION_TOTALE_TEXT = 'Consommation totale'
const CONSOMMATION_TOTALE_UNIT = 'kWh'

const PUISSANCE_MAX_TEXT = 'Puissance max'
const PUISSANCE_MAX_UNIT = 'kVa'

const INTERNAL_TEMPERATURE_TEXT = 'Température intérieure'
const EXTERNAL_TEMPERATURE_TEXT = 'Température extérieure'
const TEMPERATURE_UNIT = '°C'

describe('Widget component test', () => {
    test('when the widget is rendered with consommation totale', async () => {
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(CONSOMMATION_TOTALE_TEXT)).toBeTruthy()
        expect(getByText(CONSOMMATION_TOTALE_UNIT)).toBeTruthy()
    })
    test('when the widget is rendered with puissance max', async () => {
        mockWidgetProps.type = 'enedis_max_power'
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(PUISSANCE_MAX_TEXT)).toBeTruthy()
        expect(getByText(PUISSANCE_MAX_UNIT)).toBeTruthy()
    })
    test('when the widget is rendered with internal temperature', async () => {
        mockWidgetProps.type = 'nrlink_internal_temperature_metrics'
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(INTERNAL_TEMPERATURE_TEXT)).toBeTruthy()
        expect(getByText(TEMPERATURE_UNIT)).toBeTruthy()
    })
    test('when the widget is rendered with external temperature', async () => {
        mockWidgetProps.type = 'external_temperature_metrics'
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(EXTERNAL_TEMPERATURE_TEXT)).toBeTruthy()
        expect(getByText(TEMPERATURE_UNIT)).toBeTruthy()
    })
    test("when there is no data, the widget isn't rendered", async () => {
        mockWidgetProps.data = []
        const { container } = reduxedRender(<Widget {...mockWidgetProps} />)
        expect(container.firstChild).toBeNull()
    })
})
