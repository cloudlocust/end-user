import { reduxedRender } from 'src/common/react-platform-components/test'
import { EnergyStatusWidget } from 'src/modules/Dashboard/EnergyStatusWidget/Index'
import {
    EnergyStatusWidgetProps,
    EnergyStatusWidgetTypeEnum,
} from 'src/modules/Dashboard/EnergyStatusWidget/energyStatusWidget.d'
import { IMetric } from 'src/modules/Metrics/Metrics'

// TODO: find a way to make this modular to avoid having to write this block of code everytime.
jest.mock('dayjs', () => {
    const originalDayjs = jest.requireActual('dayjs')
    const utc = require('dayjs/plugin/utc')
    const frLocale = require('dayjs/locale/fr')

    // eslint-disable-next-line jsdoc/require-jsdoc
    const mockDayjs = (...args: string[]) => {
        return args.length ? originalDayjs(...args) : originalDayjs('2023-01-01T12:00:00.000Z')
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    mockDayjs.extend = (plugin: any) => {
        originalDayjs.extend(plugin)
    }

    // Apply the UTC plugin (and other plugins if necessary)
    mockDayjs.extend(utc)

    // eslint-disable-next-line jsdoc/require-jsdoc
    mockDayjs.locale = (locale: any) => {
        if (locale === 'fr') {
            originalDayjs.locale(frLocale)
            return
        }
        originalDayjs.locale(locale)
    }

    return mockDayjs
})

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
        expect(getByText('4 Wh')).toBeInTheDocument()
        expect(getByText('0.5 €/h')).toBeInTheDocument()
    })
    test('when type is production', async () => {
        mockkEnergyStatusWidget.type = EnergyStatusWidgetTypeEnum.PRODUCTION
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
