import { screen } from '@testing-library/react'
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
        // eslint-disable-next-line sonarjs/no-duplicate-string
        return args.length ? originalDayjs(...args) : originalDayjs('2023-01-01T12:00:00.000')
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
    })

    test('when nrlink is disconnected', async () => {
        defaultProps.lastPowerData = {
            timestamp: '2023-01-01T12:00:00.000',
            value: 2,
        }

        reduxedRender(<EnergyStatusWidget {...defaultProps} />)
        expect(screen.getByText('Connectez votre nrLINK pour voir votre consommation à la minute')).toBeInTheDocument()
    })

    test('when nrlink is off', async () => {
        defaultProps.nrlinkConsent = {
            meterGuid: '1',
            createdAt: 'false',
            nrlinkConsentState: 'NONEXISTENT',
        }
        defaultProps.lastPowerData = {
            timestamp: null,
            value: 2,
        }
        reduxedRender(<EnergyStatusWidget {...defaultProps} />)
        expect(screen.getByText('Connectez votre nrLINK pour voir votre consommation à la minute')).toBeInTheDocument()
    })

    test('when nrlink last power value is positive', async () => {
        defaultProps.lastPowerData = {
            timestamp: null,
            value: 2,
        }
        reduxedRender(<EnergyStatusWidget {...defaultProps} />)
        expect(screen.getByText('Dernière puissance remontée')).toBeInTheDocument()
        expect(screen.getByText('bolt.svg')).toBeInTheDocument()
    })

    test('when nrlink last power value is negative', async () => {
        defaultProps.lastPowerData = {
            timestamp: null,
            value: -2,
        }
        reduxedRender(<EnergyStatusWidget {...defaultProps} />)
        expect(screen.getByText('Dernière puissance injectée')).toBeInTheDocument()
        expect(screen.getByText('electric-tower.svg')).toBeInTheDocument()
        expect(() => screen.getByText('€/h')).toThrow()
    })
    test('when nrlink is connected and there is last power data', async () => {
        defaultProps.nrlinkConsent = {
            meterGuid: '1',
            createdAt: 'false',
            nrlinkConsentState: 'CONNECTED',
        }
        defaultProps.lastPowerData = {
            timestamp: '2023-01-01T12:00:00.000',
            value: 22,
        }
        reduxedRender(<EnergyStatusWidget {...defaultProps} />)
        expect(screen.getByText('Dernière puissance remontée')).toBeInTheDocument()
        expect(screen.getByText('22')).toBeInTheDocument()
        expect(screen.getByText('Wh')).toBeInTheDocument()
        expect(screen.getByText('à 11:00:00')).toBeInTheDocument()
    })
})
