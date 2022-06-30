import { reduxedRender } from 'src/common/react-platform-components/test'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'

const mockWidgetProps: IWidgetProps = {
    title: 'Consommation Totale',
    unit: 'kWh',
}

const CONSOMMATION_TOTALE_TEXT = 'Consommation Totale'
const CONSOMMATION_TOTALE_UNIT = 'kWh'

const PUISSANCE_MAX_TEXT = 'Puissance Maximale'
const PUISSANCE_MAX_UNIT = 'kVh'

const INTERNAL_TEMPERATURE_TEXT = 'Température Intérieure'
const EXTERNAL_TEMPERATURE_TEXT = 'Température Extérieure'
const TEMPERATURE_UNIT = '°C'

describe('Widget component test', () => {
    test('when the widget is rendered with consommation totale', async () => {
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(CONSOMMATION_TOTALE_TEXT)).toBeTruthy()
        expect(getByText(CONSOMMATION_TOTALE_UNIT)).toBeTruthy()
    })
    test('when the widget is rendered with puissance max', async () => {
        mockWidgetProps.title = 'Puissance Maximale'
        mockWidgetProps.unit = 'kVh'
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(PUISSANCE_MAX_TEXT)).toBeTruthy()
        expect(getByText(PUISSANCE_MAX_UNIT)).toBeTruthy()
    })
    test('when the widget is rendered with internal temperature', async () => {
        mockWidgetProps.title = 'Température Intérieure'
        mockWidgetProps.unit = '°C'
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(INTERNAL_TEMPERATURE_TEXT)).toBeTruthy()
        expect(getByText(TEMPERATURE_UNIT)).toBeTruthy()
    })
    test('when the widget is rendered with external temperature', async () => {
        mockWidgetProps.title = 'Température Extérieure'
        mockWidgetProps.unit = '°C'
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(EXTERNAL_TEMPERATURE_TEXT)).toBeTruthy()
        expect(getByText(TEMPERATURE_UNIT)).toBeTruthy()
    })
})
