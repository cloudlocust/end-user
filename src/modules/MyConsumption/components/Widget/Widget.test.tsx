import { waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'

const mockOnFormat = jest.fn()
const mockUnit = jest.fn()

const mockWidgetProps: IWidgetProps = {
    type: 'consumption_metrics',
    title: 'Consommation Totale',
    unit: mockUnit,
    period: 'daily',
    metricsInterval: '1m',
    filters: [],
    range: {
        from: '',
        to: '',
    },
    onFormat: mockOnFormat,
}

const CONSOMMATION_TOTALE_TEXT = 'Consommation Totale'
// const CONSOMMATION_TOTALE_UNIT = 'kWh'

const PUISSANCE_MAX_TEXT = 'Puissance Maximale'
const PUISSANCE_MAX_UNIT = 'kVh'

const INTERNAL_TEMPERATURE_TEXT = 'Température Intérieure'
const EXTERNAL_TEMPERATURE_TEXT = 'Température Extérieure'
const TEMPERATURE_UNIT = '°C'

describe('Widget component test', () => {
    test('when the widget is rendered with consommation totale', async () => {
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        await waitFor(
            () => {
                expect(getByText(CONSOMMATION_TOTALE_TEXT)).toBeInTheDocument()
            },
            { timeout: 6000 },
        )
    }, 10000)
    test('when the widget is rendered with puissance max', async () => {
        mockWidgetProps.title = 'Puissance Maximale'
        mockWidgetProps.unit = 'kVh'
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        await waitFor(
            () => {
                expect(getByText(PUISSANCE_MAX_TEXT)).toBeInTheDocument()
                expect(getByText(PUISSANCE_MAX_UNIT)).toBeInTheDocument()
            },
            { timeout: 6000 },
        )
    }, 10000)
    test('when the widget is rendered with internal temperature', async () => {
        mockWidgetProps.title = 'Température Intérieure'
        mockWidgetProps.unit = '°C'
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        await waitFor(
            () => {
                expect(getByText(INTERNAL_TEMPERATURE_TEXT)).toBeInTheDocument()
                expect(getByText(TEMPERATURE_UNIT)).toBeInTheDocument()
            },
            { timeout: 6000 },
        )
    }, 10000)
    test('when the widget is rendered with external temperature', async () => {
        mockWidgetProps.title = 'Température Extérieure'
        mockWidgetProps.unit = '°C'
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        await waitFor(
            () => {
                expect(getByText(EXTERNAL_TEMPERATURE_TEXT)).toBeInTheDocument()
                expect(getByText(TEMPERATURE_UNIT)).toBeInTheDocument()
            },
            { timeout: 6000 },
        )
    }, 10000)
})
