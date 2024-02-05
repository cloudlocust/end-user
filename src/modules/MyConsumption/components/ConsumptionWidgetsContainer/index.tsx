import { useContext, useEffect, useMemo } from 'react'
import { Grid } from '@mui/material'
import { useTheme } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { ConsumptionWidgetsContainerProps } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/WidgetContainer'
import { getWidgetInfoIcon } from 'src/modules/MyConsumption/components/WidgetInfoIcons'
import WidgetConsumption from 'src/modules/MyConsumption/components/WidgetConsumption'
import { ConsumptionWidgetsMetricsContext } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'
import { metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import WidgetIdleConsumption from 'src/modules/MyConsumption/components/WidgetIdleConsumption'
import { isProductionActiveAndHousingHasAccess } from 'src/modules/MyHouse/MyHouseConfig'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { getDateWithoutTimezoneOffset } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { endOfDay, startOfDay } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

/**
 * MyConsumptionWidgets Component (it's Wrapper of the list of Widgets).
 *
 * @param props N/A.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @param props.filters Metrics Filters.
 * @param props.metricsInterval Boolean state to know whether the stacked option is true or false.
 * @param props.period Indicates the current selected Period if it's monthly or daily or yearly or weekly.
 * @param props.hasMissingHousingContracts Flag HasMissingContracts.
 * @param props.enphaseOff Enphase Consent is inactive.
 * @param props.enedisOff EnedisSge Consent is not Connected.
 * @returns Consumption Widgets List Component.
 */
const ConsumptionWidgetsContainer = ({
    range,
    filters,
    metricsInterval,
    period,
    hasMissingHousingContracts,
    enphaseOff,
    enedisOff,
}: ConsumptionWidgetsContainerProps) => {
    const theme = useTheme()
    const { resetMetricsWidgetData } = useContext(ConsumptionWidgetsMetricsContext)
    const { currentHousingScopes } = useSelector(({ housingModel }: RootState) => housingModel)
    const isProductionEnabled = useMemo(
        () => isProductionActiveAndHousingHasAccess(currentHousingScopes) && !enphaseOff,
        [currentHousingScopes, enphaseOff],
    )

    const widgetsToRender = useMemo<metricTargetType[]>(() => {
        let widgetsToRender: metricTargetType[] = [metricTargetsEnum.eurosConsumption]

        if (period !== 'daily') {
            // When the period is not daily we show the Pmax widget
            widgetsToRender = [...widgetsToRender, metricTargetsEnum.pMax]
        } else {
            const currentTime = utcToZonedTime(new Date(), 'Europe/Paris')
            if (
                range.from === getDateWithoutTimezoneOffset(startOfDay(currentTime)) &&
                range.to === getDateWithoutTimezoneOffset(endOfDay(currentTime))
            ) {
                // When the period is daily and the range is today we show the external and internal temperature widgets
                widgetsToRender = [
                    ...widgetsToRender,
                    metricTargetsEnum.externalTemperature,
                    metricTargetsEnum.internalTemperature,
                ]
            }
        }

        if (isProductionEnabled) {
            widgetsToRender = [metricTargetsEnum.totalProduction, metricTargetsEnum.autoconsumption, ...widgetsToRender]
        } else {
            widgetsToRender = [metricTargetsEnum.consumption, ...widgetsToRender]
        }

        return widgetsToRender
    }, [isProductionEnabled, period, range.from, range.to])

    /**
     *   We should reset the metrics context when the range, filters, metricsInterval or period changes,
     * because we have a completely new metrics when one of those dependencies changes.
     */
    useEffect(() => {
        resetMetricsWidgetData()
    }, [range, filters, metricsInterval, period, resetMetricsWidgetData])

    /**
     * This function is to filter special metrics interval, for example the consumption_metrics in week, need to be treated as one value for the 7d.
     *
     * @param target Target that we want to get the metricsInterval for.
     * @returns Metrics Interval.
     */
    const getMetricIntervalForWidget = (target: metricTargetType) => {
        // for consumption metrics we want to get one value for all the week, their is no 1w so we use 7d
        if (target === metricTargetsEnum.consumption && period === 'weekly') return '7d'
        else return metricsInterval
    }

    return (
        <div className="p-12 sm:p-24">
            <div className="flex justify-center items-center md:justify-start">
                <TypographyFormatMessage variant="h5" className="sm:mr-8 text-black font-medium">
                    Chiffres clés
                </TypographyFormatMessage>
            </div>
            <div style={{ background: theme.palette.background.default }} className="w-full my-8">
                <Grid container spacing={{ xs: 1, md: 2 }}>
                    {/**
                     * If enphase consent is enabled, Display consumption target with a specific WidgetConsumption Component,
                     *    that displays two info : the consumption total and the purchased consumption,
                     *   (because in this case consumption total = purchased consumption + auto consumption).
                     * Otherwise it'll be displayed with then normal Widget component, that displays one info : the consumption total,
                     *    (because in this case consumption total = purchased consumption).
                     */}
                    {isProductionEnabled && (
                        <WidgetConsumption
                            targets={[metricTargetsEnum.consumption]}
                            range={range}
                            filters={filters}
                            metricsInterval={getMetricIntervalForWidget(metricTargetsEnum.consumption)}
                            period={period}
                            infoIcons={{
                                [metricTargetsEnum.consumption]: getWidgetInfoIcon({
                                    widgetTarget: metricTargetsEnum.consumption,
                                    hasMissingContracts: hasMissingHousingContracts,
                                    enphaseOff,
                                    enedisSgeOff: enedisOff,
                                }),
                            }}
                            enphaseOff={enphaseOff}
                        />
                    )}

                    <WidgetIdleConsumption
                        targets={[metricTargetsEnum.idleConsumption]}
                        range={range}
                        filters={filters}
                        metricsInterval={metricsInterval}
                        period={period}
                        infoIcons={{
                            [metricTargetsEnum.idleConsumption.toString()]: getWidgetInfoIcon({
                                widgetTarget: metricTargetsEnum.idleConsumption,
                                hasMissingContracts: hasMissingHousingContracts,
                            }),
                        }}
                    />

                    {/** Display the other targets with Widget Component. */}
                    {widgetsToRender.map((target) => {
                        return target === metricTargetsEnum.totalProduction ? (
                            <Widget
                                key={target}
                                targets={[target, metricTargetsEnum.injectedProduction]}
                                range={range}
                                filters={filters}
                                metricsInterval={metricsInterval}
                                period={period}
                                infoIcons={{
                                    [target]: getWidgetInfoIcon({
                                        widgetTarget: target,
                                        hasMissingContracts: hasMissingHousingContracts,
                                        enphaseOff,
                                        enedisSgeOff: enedisOff,
                                    }),
                                    [metricTargetsEnum.injectedProduction]: getWidgetInfoIcon({
                                        widgetTarget: metricTargetsEnum.injectedProduction,
                                        hasMissingContracts: hasMissingHousingContracts,
                                        enphaseOff,
                                        enedisSgeOff: enedisOff,
                                    }),
                                }}
                                enphaseOff={enphaseOff}
                            />
                        ) : (
                            <Widget
                                key={target}
                                targets={[target]}
                                range={range}
                                filters={filters}
                                metricsInterval={getMetricIntervalForWidget(target)}
                                period={period}
                                infoIcons={{
                                    [target]: getWidgetInfoIcon({
                                        widgetTarget: target,
                                        hasMissingContracts: hasMissingHousingContracts,
                                        enphaseOff,
                                        enedisSgeOff: enedisOff,
                                    }),
                                }}
                                enphaseOff={enphaseOff}
                            />
                        )
                    })}
                </Grid>
            </div>
        </div>
    )
}

export default ConsumptionWidgetsContainer
