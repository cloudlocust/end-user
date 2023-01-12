import { useEffect } from 'react'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { showPerPeriodText } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { useTheme } from '@mui/material'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { ProductionChartContainerProps } from 'src/modules/MyConsumption/myConsumptionTypes'
import CircularProgress from '@mui/material/CircularProgress'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { ChartErrorMessage } from 'src/modules/MyConsumption/components/ChartErrorMessage'
import { ENPHASE_OFF_MESSAGE } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { productionChartErrorState } from 'src/modules/MyConsumption/MyConsumptionConfig'

/**
 * ProductionChartContainer Component.
 *
 * @param props N/A.
 * @param props.period Indicates the current selected Period if it's monthly or daily or yearly or weekly so that we format tooltip and xAxis of chart according to the period.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @param props.metricsInterval Boolean state to know whether the stacked option is true or false.
 * @param props.filters Consumption or production chart type.
 * @param props.enphaseConsent Consumption or production chart type.
 * @returns ProductionChartContainer Component.
 */
export const ProductionChartContainer = ({
    period,
    range,
    metricsInterval,
    filters,
    enphaseConsent,
}: ProductionChartContainerProps) => {
    const theme = useTheme()
    const { data, setMetricsInterval, setRange, isMetricsLoading } = useMetrics(
        {
            interval: metricsInterval,
            range: range,
            targets: [
                {
                    target: metricTargetsEnum.autoconsumption,
                    type: 'timeserie',
                },
                {
                    target: metricTargetsEnum.injectedProduction,
                    type: 'timeserie',
                },
                {
                    target: metricTargetsEnum.totalProduction,
                    type: 'timeserie',
                },
            ],
            filters,
        },
        true,
    )

    // This state represents whether or not the chart is stacked: true.
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

    // TODO put different consentStates in an enum.
    const enphaseOff = enphaseConsent?.enphaseConsentState !== 'ACTIVE'

    // get metrics when range change.
    useEffect(() => {
        setRange(range)
    }, [range, setRange])

    // get metrics when interval change.
    useEffect(() => {
        setMetricsInterval(metricsInterval)
    }, [metricsInterval, setMetricsInterval])

    return (
        <>
            {enphaseConsent?.enphaseConsentState === 'ACTIVE' ? (
                <div className="mb-12">
                    <div className="relative flex flex-col md:flex-row justify-between items-center">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-16 md:mb-0">
                            <div className="flex flex-col md:flex-row items-center">
                                <TypographyFormatMessage
                                    variant="h5"
                                    className="sm:mr-8"
                                    style={{ color: theme.palette.primary.contrastText }}
                                >
                                    Ma Production
                                </TypographyFormatMessage>
                                {/* Consommation Watt par jour / Semaine / Mois / Année */}
                                <TypographyFormatMessage
                                    variant="h5"
                                    style={{ color: theme.palette.primary.contrastText }}
                                >
                                    {showPerPeriodText('production', period)}
                                </TypographyFormatMessage>
                            </div>
                        </motion.div>
                    </div>
                    {isMetricsLoading ? (
                        <div
                            className="flex flex-col justify-center items-center w-full h-full"
                            style={{ height: '320px' }}
                        >
                            <CircularProgress style={{ color: theme.palette.background.paper }} />
                        </div>
                    ) : (
                        <MyConsumptionChart data={data} period={period} range={range} chartType="production" />
                    )}
                </div>
            ) : (
                productionChartErrorState && (
                    <ChartErrorMessage
                        enphaseOff={enphaseOff}
                        enphaseOffMessage={ENPHASE_OFF_MESSAGE}
                        linkTo={`/my-houses/${currentHousing?.id}`}
                    />
                )
            )}
        </>
    )
}
