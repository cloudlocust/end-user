import { reduxedRender } from 'src/common/react-platform-components/test'
import { MyConsumptionContainer } from 'src/modules/MyConsumption/MyConsumptionContainer'
import { BrowserRouter as Router } from 'react-router-dom'
import { IMetric } from 'src/modules/Metrics/Metrics'
import { TEST_SUCCESS_WEEK_METRICS } from 'src/mocks/handlers/metrics'

let mockData: IMetric[] = TEST_SUCCESS_WEEK_METRICS(['consumption_metrics'])
let mockNrlinkConsent: string
let mockEnedisConsent: string

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
        interval: '2m',
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
        getConsents: jest.fn(),
    }),
}))

// MyConsumptionContainer cannot render if we don't mock react-apexcharts
jest.mock(
    'react-apexcharts',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) => <div className="apexcharts-svg" {...props}></div>,
)

describe('MyConsumptionContainer test', () => {
    test('when there is no nrlinkConsent and no enedisConsent, a message is shown', () => {
        mockData = []
        mockNrlinkConsent = 'NONEXISTENT'
        mockEnedisConsent = 'NONEXISTENT'
        const { getByText } = reduxedRender(
            <Router>
                <MyConsumptionContainer />
            </Router>,
        )
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
})
