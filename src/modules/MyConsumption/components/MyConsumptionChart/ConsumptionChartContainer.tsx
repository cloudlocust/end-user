import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { useTheme } from '@mui/material'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { ConsumptionChartContainerProps } from 'src/modules/MyConsumption/myConsumptionTypes'
import { useIntl } from 'react-intl'
import CircularProgress from '@mui/material/CircularProgress'
import TargetButtonGroup from 'src/modules/MyConsumption/components/TargetButtonGroup'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import EurosConsumptionButtonToggler from 'src/modules/MyConsumption/components/EurosConsumptionButtonToggler'
import Tooltip from '@mui/material/Tooltip'
import { tempPmaxFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import { warningMainHashColor } from 'src/modules/utils/muiThemeVariables'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { NavLink } from 'react-router-dom'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { showPerPeriodText } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'

/**
 * MyConsumptionChart Component.
 *
 * @param props N/A.
 * @param props.period Indicates the current selected Period if it's monthly or daily or yearly or weekly so that we format tooltip and xAxis of chart according to the period.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @param props.metricsInterval Boolean state to know whether the stacked option is true or false.
 * @param props.filters Consumption or production chart type.
 * @param props.hasMissingHousingContracts Consumption or production chart type.
 * @param props.enedisSgeConsent Consumption or production chart type.
 * @param props.enphaseConsent Consumption or production chart type.
 * @returns MyConsumptionChart Component.
 */
export const ConsumptionChartContainer = ({
    period,
    range,
    metricsInterval,
    filters,
    hasMissingHousingContracts,
    enedisSgeConsent,
    enphaseConsent,
}: ConsumptionChartContainerProps) => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const { isMetricsLoading, data, addTarget, removeTarget, setFilters, setRange, setMetricsInterval } = useMetrics({
        interval: metricsInterval,
        range: range,
        targets: [
            {
                target: metricTargetsEnum.autoconsumption,
                type: 'timeserie',
            },
            {
                target: metricTargetsEnum.consumption,
                type: 'timeserie',
            },
        ],
        filters,
    })
    // This state represents whether or not the chart is stacked: true.
    const isEurosConsumptionChart = data.some((datapoint) =>
        datapoint.target.includes(metricTargetsEnum.eurosConsumption),
    )
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    // This state represents whether or not the chart is stacked: true.
    const [isStackedEnabled, setIsStackedEnabled] = useState<boolean>(true)

    // Desire behaviour is to focus on consumption and autoconsumption, this handles the spinner state only for the focused targets.
    // Because initially we load consumption and autoconsumption thus data is empty. Once those fetched.
    // Then fetching other target (€) will not show a spinner and will be done without any user experience knowing it.
    const isMetricsConsumptionTargetLoading = isMetricsLoading && !data.length

    // Once data changes for consumption and autoConsumption, Fetch remaining targets.
    useEffect(() => {
        // Check that useEffect triggers only when we have consumption and autoconsumption.
        if (
            data.filter((datapoint) =>
                [metricTargetsEnum.consumption, metricTargetsEnum.autoconsumption].includes(
                    datapoint.target as metricTargetsEnum,
                ),
            )
        )
            addTarget(metric)
        // data.forEach((datapoint) => {
        //     if (
        //         datapoint.target === metricTargetsEnum.externalTemperature ||
        //         datapoint.target === metricTargetsEnum.internalTemperature ||
        //         datapoint.target !== metricTargetsEnum.pMax
        //     )
        //         setIsStackedEnabled(true)
        // })
    }, [data])

    useEffect(() => {
        setFilters(filters)
    }, [filters, setFilters])

    useEffect(() => {
        setRange(range)
    }, [range, setRange])

    useEffect(() => {
        setMetricsInterval(metricsInterval)
    }, [metricsInterval, setMetricsInterval])

    return (
        <div className="mb-12">
            <div className="relative flex flex-col md:flex-row justify-between items-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-16 md:mb-0">
                    <div className="flex flex-col md:flex-row items-center">
                        <TypographyFormatMessage
                            variant="h5"
                            className="sm:mr-8"
                            style={{ color: theme.palette.primary.contrastText }}
                        >
                            Ma Consommation
                        </TypographyFormatMessage>
                        {/* Consommation Wh par Jour / Semaine / Mois / Année */}
                        <TypographyFormatMessage variant="h5" style={{ color: theme.palette.primary.contrastText }}>
                            {showPerPeriodText('consumption', period, isEurosConsumptionChart)}
                        </TypographyFormatMessage>
                    </div>
                </motion.div>
            </div>

            <div className="my-16 flex justify-between">
                <EurosConsumptionButtonToggler
                    removeTarget={removeTarget}
                    addTarget={addTarget}
                    showEurosConsumption={!isEurosConsumptionChart}
                />
                <Tooltip
                    arrow
                    placement="bottom-end"
                    disableHoverListener={!tempPmaxFeatureState}
                    title={formatMessage({
                        id: "Cette fonctionnalité n'est pas disponible sur cette version",
                        defaultMessage: "Cette fonctionnalité n'est pas disponible sur cette version",
                    })}
                >
                    <div className={`${tempPmaxFeatureState && 'cursor-not-allowed'}`}>
                        <TargetButtonGroup
                            removeTarget={removeTarget}
                            addTarget={addTarget}
                            hidePmax={period === 'daily' || enedisSgeConsent?.enedisSgeConsentState === 'NONEXISTENT'}
                        />
                    </div>
                </Tooltip>
            </div>

            {isMetricsConsumptionTargetLoading ? (
                <div className="flex flex-col justify-center items-center w-full h-full" style={{ height: '320px' }}>
                    <CircularProgress style={{ color: theme.palette.background.paper }} />
                </div>
            ) : (
                <MyConsumptionChart
                    data={data}
                    period={period}
                    range={range}
                    isStackedEnabled={isStackedEnabled}
                    chartType="consumption"
                    chartLabel={
                        enphaseConsent?.enphaseConsentState !== 'ACTIVE'
                            ? 'Consommation totale'
                            : 'Electricité achetée sur le réseau'
                    }
                />
            )}

            {isEurosConsumptionChart && hasMissingHousingContracts && (
                <div className="flex items-center justify-center flex-col mt-12">
                    <ErrorOutlineIcon
                        sx={{
                            color: warningMainHashColor,
                            width: { xs: '24px', md: '32px' },
                            height: { xs: '24px', md: '32px' },
                            margin: { xs: '0 0 4px 0', md: '0 8px 0 0' },
                        }}
                    />

                    <div className="w-full">
                        <TypographyFormatMessage
                            sx={{ color: warningMainHashColor }}
                            className="text-13 md:text-16 text-center"
                        >
                            {
                                "Ce graphe est un exemple basé sur un tarif Bleu EDF Base. Vos données contractuelles de fourniture d'énergie ne sont pas disponibles sur toute la période."
                            }
                        </TypographyFormatMessage>
                        <NavLink to={`${URL_MY_HOUSE}/${currentHousing?.id}/contracts`}>
                            <TypographyFormatMessage
                                className="underline text-13 md:text-16 text-center"
                                sx={{ color: warningMainHashColor }}
                            >
                                Renseigner votre contrat d'énergie
                            </TypographyFormatMessage>
                        </NavLink>
                    </div>
                </div>
            )}
        </div>
    )
}
