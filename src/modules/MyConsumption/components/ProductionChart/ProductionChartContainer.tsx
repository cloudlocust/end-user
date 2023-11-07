import { useEffect } from 'react'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { showPerPeriodText } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { useTheme } from '@mui/material'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { ProductionChartContainerProps } from 'src/modules/MyConsumption/myConsumptionTypes'
import CircularProgress from '@mui/material/CircularProgress'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { ChartErrorMessage } from 'src/modules/MyConsumption/components/ChartErrorMessage'
import { ENPHASE_OFF_MESSAGE, PRODUCTION_OFF_MESSAGE } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { productionChartErrorState } from 'src/modules/MyConsumption/MyConsumptionConfig'
import { arePlugsUsedBasedOnProductionStatus } from 'src/modules/MyHouse/MyHouseConfig'
import EchartsProductionChart from 'src/modules/MyConsumption/components/ProductionChart'

/**
 * ProductionChartContainer Component.
 *
 * @param props N/A.
 * @param props.period Indicates the current selected Period if it's monthly or daily or yearly or weekly so that we format tooltip and xAxis of chart according to the period.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @param props.metricsInterval Boolean state to know whether the stacked option is true or false.
 * @param props.filters Consumption or production chart type.
 * @param props.isProductionConsentOff Boolean indicating if proudction consent is off.
 * @param props.isProductionConsentLoadingInProgress Boolean indicating if production consent is in-progress.
 * @returns ProductionChartContainer Component.
 */
export const ProductionChartContainer = ({
    period,
    range,
    metricsInterval,
    filters,
    isProductionConsentOff,
    isProductionConsentLoadingInProgress,
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

    const isProductionChartLoadingInProgress = isMetricsLoading || isProductionConsentLoadingInProgress

    // This state represents whether or not the chart is stacked: true.
    const { currentHousing, currentHousingScopes } = useSelector(({ housingModel }: RootState) => housingModel)

    // get metrics when range change.
    useEffect(() => {
        setRange(range)
    }, [range, setRange])

    // get metrics when interval change.
    useEffect(() => {
        setMetricsInterval(metricsInterval)
    }, [metricsInterval, setMetricsInterval])

    if (isProductionChartLoadingInProgress)
        return (
            <div className="flex flex-col justify-center items-center w-full h-full" style={{ height: '320px' }}>
                <CircularProgress style={{ color: theme.palette.background.paper }} />
            </div>
        )

    if (isProductionConsentOff)
        return (
            <>
                {productionChartErrorState && (
                    <ChartErrorMessage
                        productionConsentOff={true}
                        productionConsentOffMessage={
                            arePlugsUsedBasedOnProductionStatus(currentHousingScopes)
                                ? PRODUCTION_OFF_MESSAGE
                                : ENPHASE_OFF_MESSAGE
                        }
                        linkTo={`/my-houses/${currentHousing?.id}`}
                    />
                )}
            </>
        )

    return (
        <div className="mb-12">
            <div className="relative flex flex-col md:flex-row items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-10 md:mb-0 flex flex-col items-center md:flex-row text-center"
                >
                    <TypographyFormatMessage
                        variant="h5"
                        className="sm:mr-8"
                        style={{ color: theme.palette.primary.contrastText }}
                    >
                        Ma production
                    </TypographyFormatMessage>
                    {/* Consommation Watt par jour / Semaine / Mois / Année */}
                    <TypographyFormatMessage variant="h5" style={{ color: theme.palette.primary.contrastText }}>
                        {showPerPeriodText('production', period)}
                    </TypographyFormatMessage>
                </motion.div>
            </div>
            <EchartsProductionChart period={period} data={data} />
        </div>
    )
}
