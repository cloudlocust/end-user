import { reduxedRender } from 'src/common/react-platform-components/test'
import Analysis from 'src/modules/Analysis'
import { BrowserRouter as Router } from 'react-router-dom'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { TEST_SUCCESS_MONTH_METRICS } from 'src/mocks/handlers/metrics'
import { IMeter } from 'src/modules/Meters/Meters'
import { TEST_METERS } from 'src/mocks/handlers/meters'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'

let mockData: IMetric[] = TEST_SUCCESS_MONTH_METRICS([metricTargetsEnum.consumption])
let mockNrlinkConsent: string
let mockEnedisConsent: string
let mockSetRange = jest.fn()
let mockIsMetricsLoading = false
const circularProgressClassname = '.MuiCircularProgress-root'
const CONSENT_TEXT = "Pour voir votre consommation vous devez d'abord"
const mockRange = {
    from: '2022-05-01T00:00:00.000Z',
    to: '2022-05-31T23:59:59.999Z',
}
const REDIRECT_TEXT = 'enregistrer votre compteur et votre nrLink'
let mockMeterList: IMeter[] | null = TEST_METERS
const INCREMENT_DATE_ARROW_TEXT = 'chevron_right'

// Mock metersHook
jest.mock('src/modules/Meters/metersHook', () => ({
    ...jest.requireActual('src/modules/Meters/metersHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMeterList: () => ({
        elementList: mockMeterList,
    }),
}))
// Mock metricsHook
jest.mock('src/modules/Metrics/metricsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMetrics: () => ({
        data: mockData,
        isMetricsLoading: mockIsMetricsLoading,
        filters: [
            {
                key: 'meter_guid',
                operator: '=',
                value: '123456789',
            },
        ],
        range: mockRange,
        interval: '1d',
        setFilters: jest.fn(),
        setRange: mockSetRange,
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

describe('Analysis test', () => {
    test('When DatePicker change setRange should be called', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <Analysis />
            </Router>,
        )

        // INCREMENT DATE BUTTON
        userEvent.click(getByText(INCREMENT_DATE_ARROW_TEXT))
        await waitFor(() => {
            // When we increment a period, we increment "to" in range.
            expect(mockSetRange).toHaveBeenCalledWith({
                from: '2022-06-01T00:00:00.000Z',
                to: '2022-06-30T23:59:59.999Z',
            })
        })
    })
    test('when there is no nrlinkConsent and no enedisConsent, awarening text is shown', async () => {
        mockNrlinkConsent = 'NONEXISTENT'
        mockEnedisConsent = 'NONEXISTENT'
        const { getByText } = reduxedRender(
            <Router>
                <Analysis />
            </Router>,
        )
        expect(getByText(CONSENT_TEXT)).toBeTruthy()
        expect(getByText(REDIRECT_TEXT)).toBeTruthy()
    })
    test('when data is not empty total consumption should be shown', async () => {
        mockNrlinkConsent = 'CONNECTED'
        mockEnedisConsent = 'CONNECTED'
        const totalDataPoints = 1000
        const TOTAL_CONSUMPTION_TEXT = `1 kWh`
        mockData[0].datapoints = [[totalDataPoints, 1643628944000]]
        const { getByText } = reduxedRender(
            <Router>
                <Analysis />
            </Router>,
        )
        expect(getByText(TOTAL_CONSUMPTION_TEXT)).toBeTruthy()
    })
    test('when data from useMetrics is empty', async () => {
        mockNrlinkConsent = 'CONNECTED'
        mockEnedisConsent = 'CONNECTED'
        mockData = []
        const { getByText } = reduxedRender(
            <Router>
                <Analysis />
            </Router>,
        )
        expect(getByText('0 kWh')).toBeTruthy()
    })
    test('when isMetricsLoading spinner is shown', async () => {
        mockIsMetricsLoading = true
        mockNrlinkConsent = 'CONNECTED'
        mockEnedisConsent = 'CONNECTED'
        const { container } = reduxedRender(
            <Router>
                <Analysis />
            </Router>,
        )
        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })
})
