// import { waitFor,  } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_SUCCESS_DAY_METRICS } from 'src/mocks/handlers/metrics'
import { IMetric } from 'src/modules/Metrics/Metrics'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'

let mockData: IMetric[] = TEST_SUCCESS_DAY_METRICS([
    'consumption_metrics',
    'enedis_max_power',
    'external_temperature_metrics',
    'nrlink_internal_temperature_metrics',
])

jest.mock('src/modules/Metrics/metricsHook.ts', () => ({
    ...jest.requireActual('src/modules/Metrics/metricsHook.ts'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMetrics: () => ({
        data: mockData,
        setFilters: jest.fn(),
        setMetricsInterval: jest.fn(),
        setRange: jest.fn(),
        range: {
            from: '',
            to: '',
        },
    }),
}))

let mockValue = jest.fn()
let mockUnit = jest.fn()

let mockWidgetProps: IWidgetProps = {
    type: 'consumption_metrics',
    title: 'Consommation Totale',
    unit: mockUnit,
    period: 'daily',
    metricsInterval: '2min',
    filters: [],
    range: {
        from: '',
        to: '',
    },
    value: mockValue,
}

const CONSOMMATION_TOTALE_TEXT = 'Consommation Totale'
const CONSOMMATION_TOTALE_UNIT = 'kWh'

const PUISSANCE_MAX_TEXT = 'Puissance Maximale'
const PUISSANCE_MAX_UNIT = 'kVa'

const INTERNAL_TEMPERATURE_TEXT = 'Température Intérieure'
const EXTERNAL_TEMPERATURE_TEXT = 'Température Extérieure'
const TEMPERATURE_UNIT = '°C'

const NO_DATA_MESSAGE = 'Aucune donnée disponnible'

describe('Widget component test', () => {
    test('when the widget is rendered with consommation totale', async () => {
        mockUnit.mockReturnValue('kWh')
        mockValue.mockReturnValue(123)
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(CONSOMMATION_TOTALE_TEXT)).toBeInTheDocument()
        expect(getByText(CONSOMMATION_TOTALE_UNIT)).toBeInTheDocument()
    })
    test('when the widget is rendered with puissance max', async () => {
        mockWidgetProps.title = 'Puissance Maximale'
        mockUnit.mockReturnValue('kVa')
        mockValue.mockReturnValue(123)
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(PUISSANCE_MAX_TEXT)).toBeInTheDocument()
        expect(getByText(PUISSANCE_MAX_UNIT)).toBeInTheDocument()
    })
    test('when the widget is rendered with internal temperature', async () => {
        mockWidgetProps.title = 'Température Intérieure'
        mockUnit.mockReturnValue('°C')
        mockValue.mockReturnValue(123)
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(INTERNAL_TEMPERATURE_TEXT)).toBeInTheDocument()
        expect(getByText(TEMPERATURE_UNIT)).toBeInTheDocument()
    })
    test('when the widget is rendered with external temperature', async () => {
        mockWidgetProps.title = 'Température Extérieure'
        mockUnit.mockReturnValue('°C')
        mockValue.mockReturnValue(123)
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(EXTERNAL_TEMPERATURE_TEXT)).toBeInTheDocument()
        expect(getByText(TEMPERATURE_UNIT)).toBeInTheDocument()
    })
    test('when there is no data, an error message is shown', async () => {
        mockValue.mockReturnValue(null)
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(NO_DATA_MESSAGE)).toBeTruthy()
    })
})
