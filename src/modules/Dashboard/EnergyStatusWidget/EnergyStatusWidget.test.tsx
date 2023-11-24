import { waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { EnergyStatusWidget } from 'src/modules/Dashboard/EnergyStatusWidget/Index'
import {
    EnergyStatusWidgetProps,
    EnergyStatusWidgetTypeEnum,
} from 'src/modules/Dashboard/EnergyStatusWidget/energyStatusWidget.d'
import { IMetric } from 'src/modules/Metrics/Metrics'

describe('EnergyStatusWidget', () => {
    let mockkEnergyStatusWidget: EnergyStatusWidgetProps

    beforeEach(() => {
        mockkEnergyStatusWidget = {
            data: [],
            isLoading: false,
            type: EnergyStatusWidgetTypeEnum.CONSUMPTION,
            pricePerKwh: 0.5,
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
                    [4.0, new Date('2023-01-01T11:56:00.000Z').getTime()],
                ],
            },
        ] as IMetric[]
        const { getByText } = reduxedRender(<EnergyStatusWidget {...mockkEnergyStatusWidget} />)

        expect(getByText('Dernière puissance remontée')).toBeInTheDocument()
        expect(getByText('bolt.svg')).toBeInTheDocument()
        expect(getByText('à 12:56:00')).toBeInTheDocument()
        expect(getByText('0.5 €/h')).toBeInTheDocument()
        await waitFor(() => {
            expect(getByText('4 kWh')).toBeInTheDocument()
        })
    })
    test('when type is production', async () => {
        mockkEnergyStatusWidget.type = EnergyStatusWidgetTypeEnum.CONSUMPTION
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
