import { reduxedRender } from 'src/common/react-platform-components/test'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'

let mockWidgetProps: IWidgetProps = {
    title: 'Consommation Totale',
    isMetricsLoading: false,
    unit: 'kWh',
    value: 0,
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
            title: CONSOMMATION_TOTALE_TEXT,
            unit: CONSOMMATION_TOTALE_UNIT,
            value: 1000,
        }

        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(CONSOMMATION_TOTALE_TEXT)).toBeInTheDocument()
        expect(getByText(CONSOMMATION_TOTALE_UNIT)).toBeInTheDocument()
        expect(getByText(1000)).toBeInTheDocument()
    })
    test('when the widget is rendered with puissance max', async () => {
        mockWidgetProps = {
            isMetricsLoading: false,
            title: PUISSANCE_MAX_TEXT,
            unit: PUISSANCE_MAX_UNIT,
            value: 1000,
        }

        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(PUISSANCE_MAX_TEXT)).toBeInTheDocument()
        expect(getByText(PUISSANCE_MAX_UNIT)).toBeInTheDocument()
        expect(getByText(1000)).toBeInTheDocument()
    })
    test('when the widget is rendered with internal temperature', async () => {
        mockWidgetProps = {
            isMetricsLoading: false,
            title: INTERNAL_TEMPERATURE_TEXT,
            unit: TEMPERATURE_UNIT,
            value: 50,
        }
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(INTERNAL_TEMPERATURE_TEXT)).toBeInTheDocument()
        expect(getByText(TEMPERATURE_UNIT)).toBeInTheDocument()
        expect(getByText(50)).toBeInTheDocument()
    })
    test('when the widget is rendered with external temperature', async () => {
        mockWidgetProps = {
            isMetricsLoading: false,
            title: EXTERNAL_TEMPERATURE_TEXT,
            unit: TEMPERATURE_UNIT,
            value: 50,
        }
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(EXTERNAL_TEMPERATURE_TEXT)).toBeInTheDocument()
        expect(getByText(TEMPERATURE_UNIT)).toBeInTheDocument()
        expect(getByText(50)).toBeInTheDocument()
    })
    test('when there is no data, an error message is shown', async () => {
        mockWidgetProps.value = NaN
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(NO_DATA_MESSAGE)).toBeTruthy()
    })
})
