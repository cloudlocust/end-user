import { reduxedRender } from 'src/common/react-platform-components/test'
import { EnergyStatusWidget } from 'src/modules/Dashboard/EnergyStatusWidget/Index'
import { EnergyStatusWidgetProps } from 'src/modules/Dashboard/EnergyStatusWidget/energyStatusWidget'
import { IMetric } from 'src/modules/Metrics/Metrics'

describe('EnergyStatusWidget', () => {
    let mockkEnergyStatusWidget: EnergyStatusWidgetProps

    beforeEach(() => {
        mockkEnergyStatusWidget = {
            data: [],
            isLoading: false,
            type: 'consumption',
        }
    })

    test('when type is consumption', async () => {
        mockkEnergyStatusWidget.data = [
            {
                target: 'consumption_metrics',
                datapoints: [
                    [null, new Date('2023-01-01T11:53:00.000Z').getTime()],
                    [6.0, new Date('2023-01-01T11:54:00.000Z').getTime()],
                    [2.0, new Date('2023-01-01T11:55:00.000Z').getTime()],
                ],
            },
        ] as IMetric[]
        const { getByText } = reduxedRender(<EnergyStatusWidget {...mockkEnergyStatusWidget} />)

        expect(getByText('Dernière puissance remontée')).toBeInTheDocument()
        expect(getByText('bolt.svg')).toBeInTheDocument()
        expect(getByText('2 Wh')).toBeInTheDocument()
        expect(getByText('€/h')).toBeInTheDocument()
    })
    test('when type is production', async () => {
        mockkEnergyStatusWidget.type = 'production'
        mockkEnergyStatusWidget.data = [
            {
                target: 'consumption_metrics',
                datapoints: [
                    [null, new Date('2023-01-01T11:53:00.000Z').getTime()],
                    [6.0, new Date('2023-01-01T11:54:00.000Z').getTime()],
                    [2.0, new Date('2023-01-01T11:55:00.000Z').getTime()],
                ],
            },
        ] as IMetric[]
        const { getByText } = reduxedRender(<EnergyStatusWidget {...mockkEnergyStatusWidget} />)
        expect(getByText('Dernière puissance injectée')).toBeInTheDocument()
        expect(getByText('electric-tower.svg')).toBeInTheDocument()
        expect(() => getByText('€/h')).toThrow()
    })
})
