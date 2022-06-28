import { waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { Widget } from 'src/modules/MyConsumption'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widgets/Widget'

let mockWidgetProps: IWidgetProps = {
    type: 'consumption_metrics',
    period: 'daily',
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
        await waitFor(
            () => {
                expect(getByText(CONSOMMATION_TOTALE_TEXT)).toBeInTheDocument()
                expect(getByText(CONSOMMATION_TOTALE_UNIT)).toBeInTheDocument()
            },
            { timeout: 6000 },
        )
    }, 10000)
    test('when the widget is rendered with puissance max', async () => {
        mockWidgetProps.type = 'enedis_max_power'
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
        mockWidgetProps.type = 'nrlink_internal_temperature_metrics'
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
        mockWidgetProps.type = 'external_temperature_metrics'
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
