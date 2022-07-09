import { reduxedRender } from 'src/common/react-platform-components/test'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'

let mockWidgetProps: IWidgetProps = {
    type: 'consumption_metrics',
    isMetricsLoading: false,
    computeAssets: {
        unit: 'kWh',
        value: 1,
    },
}

const CONSOMMATION_TOTALE_TEXT = 'Consommation Totale'
const CONSOMMATION_TOTALE_UNIT = 'kWh'

const PUISSANCE_MAX_TEXT = 'Puissance Maximale'
const PUISSANCE_MAX_UNIT = 'kVa'

const INTERNAL_TEMPERATURE_TEXT = 'Température Intérieure'
const EXTERNAL_TEMPERATURE_TEXT = 'Température Extérieure'
const TEMPERATURE_UNIT = '°C'

const NO_DATA_MESSAGE = 'Aucune donnée disponnible'
const circularProgressClassname = '	.MuiCircularProgress-root'

describe('Widget component test', () => {
    test('when isMetricLoading is true, a spinner is shown', async () => {
        mockWidgetProps = {
            ...mockWidgetProps,
            isMetricsLoading: true,
        }
        const { container } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })
    test('when the widget is rendered with consommation totale', async () => {
        mockWidgetProps = {
            isMetricsLoading: false,
            type: 'consumption_metrics',
            computeAssets: {
                unit: 'kWh',
                value: 1000,
            },
        }

        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(CONSOMMATION_TOTALE_TEXT)).toBeInTheDocument()
        expect(getByText(CONSOMMATION_TOTALE_UNIT)).toBeInTheDocument()
    })
    test('when the widget is rendered with puissance max', async () => {
        mockWidgetProps = {
            isMetricsLoading: false,
            type: 'enedis_max_power',
            computeAssets: {
                unit: 'kVa',
                value: 1000,
            },
        }

        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(PUISSANCE_MAX_TEXT)).toBeInTheDocument()
        expect(getByText(PUISSANCE_MAX_UNIT)).toBeInTheDocument()
    })
    test('when the widget is rendered with internal temperature', async () => {
        mockWidgetProps = {
            isMetricsLoading: false,
            type: 'nrlink_internal_temperature_metrics',
            computeAssets: {
                unit: '°C',
                value: 10,
            },
        }
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(INTERNAL_TEMPERATURE_TEXT)).toBeInTheDocument()
        expect(getByText(TEMPERATURE_UNIT)).toBeInTheDocument()
    })
    test('when the widget is rendered with external temperature', async () => {
        mockWidgetProps = {
            isMetricsLoading: false,
            type: 'external_temperature_metrics',
            computeAssets: {
                unit: '°C',
                value: 1,
            },
        }
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(EXTERNAL_TEMPERATURE_TEXT)).toBeInTheDocument()
        expect(getByText(TEMPERATURE_UNIT)).toBeInTheDocument()
    })
    test('when there is no data, an error message is shown', async () => {
        mockWidgetProps.computeAssets.value = NaN
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(NO_DATA_MESSAGE)).toBeTruthy()
    })
})
