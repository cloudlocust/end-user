import { reduxedRender } from 'src/common/react-platform-components/test'
import { MyConsumptionContainer } from 'src/modules/MyConsumption/MyConsumptionContainer'
import { BrowserRouter as Router } from 'react-router-dom'
import { IMetric } from 'src/modules/Metrics/Metrics'
import { TEST_SUCCESS_WEEK_METRICS } from 'src/mocks/handlers/metrics'
import { waitFor } from '@testing-library/react'
import { formatMetricFilter } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'

expect(TEST_METERS).toBe('QSDFQFS')
let mockData: IMetric[] = TEST_SUCCESS_WEEK_METRICS(['consumption_metrics'])
let mockNrlinkConsent: string
let mockEnedisConsent: string
const mockSetFilters = jest.fn()
const mockGetConsents = jest.fn()
let mockMeterList = TEST_METERS

// Mock metricsHook
jest.mock('src/modules/Metrics/metricsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMetrics: () => ({
        data: mockData,
        isMetricsLoading: false,
        filters: [
            {
                key: 'meter_guid',
                operator: '=',
                value: '123456789',
            },
        ],
        range: {
            from: '2022-06-04T00:00:00.000Z',
            to: '2022-06-04T23:59:59.999Z',
        },
        interval: '2min',
        setFilters: mockSetFilters,
    }),
}))

// Mock consentsHook
jest.mock('src/modules/Consents/consentsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsents: () => ({
        enedisConsent: {
            meterGuid: '133456',
            enedisConsentState: mockNrlinkConsent,
        },
        nrlinkConsent: {
            meterGuid: '133456',
            nrlinkConsentState: mockEnedisConsent,
        },
        getConsents: mockGetConsents,
    }),
}))

// Mock useMeters
jest.mock('src/modules/Meters/metersHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMeters: () => ({
        elementList: mockMeterList,
    }),
}))
// MyConsumptionContainer cannot render if we don't mock react-apexcharts
jest.mock(
    'react-apexcharts',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) => <div className="apexcharts-svg" {...props}></div>,
)

describe('MyConsumptionContainer test', () => {
    test('when there is no nrlinkConsent and no enedisConsent, a message is shown', async () => {
        mockData = []
        mockNrlinkConsent = 'NONEXISTENT'
        mockEnedisConsent = 'NONEXISTENT'
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
        )
        await waitFor(() => {
            expect(mockGetConsents).toHaveBeenCalled()
        })
        expect(getByText("Pour voir votre consommation vous devez d'abord")).toBeTruthy()
        expect(getByText('enregistrer votre compteur et votre nrLink')).toBeTruthy()
    })
    test("when data from useMetrics is empty, widget section isn't shown", async () => {
        mockNrlinkConsent = 'CONNECTED'
        mockEnedisConsent = 'CONNECTED'
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
        )
        expect(() => getByText('Chiffres clés')).toThrow()
    })
    test('MeterList not empty, then filters metrics should have first element of meterList, otherwise setFilters is not called', async () => {
        reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
        )
        await waitFor(() => {
            expect(mockSetFilters).toHaveBeenCalledWith(formatMetricFilter(mockMeterList[0].guid))
        })
        mockMeterList = []
        await waitFor(() => {
            expect(mockSetFilters).toHaveBeenCalledTimes(1)
        })
    })
})
