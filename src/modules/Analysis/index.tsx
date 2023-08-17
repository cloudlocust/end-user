import MultiTab from 'src/common/ui-kit/components/MultiTab/MultiTab'
import AnalysisSummary from 'src/modules/Analysis/tabs/AnalysisSummary'
import AnalysisComparison from 'src/modules/Analysis/tabs/AnalysisComparison'
import { ReactComponent as AnalyzeSummaryIcon } from 'src/assets/images/summary.svg'
import { ReactComponent as AnalyzeComparisonIcon } from 'src/assets/images/comparison.svg'
import AnalysisHeader from 'src/modules/Analysis/components/AnalysisHeader'
import { getMetricType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import {
    formatMetricFilter,
    getDateWithoutTimezoneOffset,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { useHasMissingHousingContracts } from 'src/hooks/HasMissingHousingContracts'
import { RootState } from 'src/redux'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { ThemeProvider, useTheme, useMediaQuery } from '@mui/material'

/**
 * InitialMetricsStates for useMetrics.
 */
export const initialMetricsHookValues: getMetricType = {
    interval: '1d',
    range: {
        from: getDateWithoutTimezoneOffset(startOfMonth(subMonths(new Date(), 1))),
        to: getDateWithoutTimezoneOffset(endOfMonth(subMonths(new Date(), 1))),
    },
    targets: [
        {
            target: metricTargetsEnum.consumption,
            type: 'timeserie',
        },
        {
            target: metricTargetsEnum.eurosConsumption,
            type: 'timeserie',
        },
        {
            target: metricTargetsEnum.pMax,
            type: 'timeserie',
        },
    ],
    filters: [],
}

/**
 * Analysis component.
 *
 * @returns Analysis JSX.
 */
export default function Analysis() {
    const theme = useTheme()
    const mdDown = useMediaQuery(theme.breakpoints.down('md'))
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { getConsents, nrlinkConsent, enedisSgeConsent } = useConsents()
    const { range, setFilters, filters, data, isMetricsLoading, setRange } = useMetrics(initialMetricsHookValues)
    const { hasMissingHousingContracts } = useHasMissingHousingContracts(range, currentHousing?.id)

    // Indicates if enedisSgeConsent is not Connected
    const enedisSgeOff = enedisSgeConsent?.enedisSgeConsentState !== 'CONNECTED'

    useEffect(() => {
        if (!currentHousing?.meter?.guid) return
        setFilters(formatMetricFilter(currentHousing?.meter.guid))
        getConsents(currentHousing?.id)
    }, [currentHousing?.meter?.guid, setFilters, getConsents, currentHousing?.id])

    const tabsContent = [
        {
            tabTitle: 'Bilan',
            tabSlug: 'summary',
            tabContent: (
                <AnalysisSummary
                    {...{
                        data,
                        range,
                        setFilters,
                        filters,
                        isMetricsLoading,
                        nrlinkConsent,
                        enedisSgeConsent,
                        currentHousing,
                        hasMissingHousingContracts,
                    }}
                />
            ),
            icon: <AnalyzeSummaryIcon />,
        },
        {
            tabTitle: 'Comparaison',
            tabSlug: 'comparison',
            tabContent: <AnalysisComparison {...{ filters, monthlyRange: range }} />,
            icon: <AnalyzeComparisonIcon />,
        },
    ]

    return (
        <ThemeProvider theme={theme}>
            <MultiTab
                header={<AnalysisHeader {...{ enedisSgeOff, range, setRange }} />}
                content={tabsContent}
                innerScroll
                TabsProps={{ variant: 'fullWidth' }}
                rootCss={{
                    height: 'auto',
                    minHeight: 'auto',
                    margin: `${!mdDown ? '0' : '0.5rem'}`,
                }}
                isUseRouting={false}
            />
        </ThemeProvider>
    )
}
