import { reduxedRender } from 'src/common/react-platform-components/test'
import { EnergyStatusWidget } from 'src/modules/Dashboard/StatusWrapper/components/EnergyStatusWidget/Index'
import { EnergyStatusWidgetProps } from 'src/modules/Dashboard/StatusWrapper/components/EnergyStatusWidget/energyStatusWidget'

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
    let defaultProps: EnergyStatusWidgetProps

    beforeEach(() => {
        defaultProps = {
            isNrlinkPowerLoading: false,
            pricePerKwh: 0,
            lastPowerData: {
                timestamp: '2023-01-01T12:00:00.000Z',
                value: 0,
            },
            nrlinkConsent: {
                meterGuid: '1',
                createdAt: 'false',
                nrlinkConsentState: 'DISCONNECTED',
            },
        }

        reduxedRender(<EnergyStatusWidget {...defaultProps} />)
    })

    test('when there is no data', async () => {})
})
