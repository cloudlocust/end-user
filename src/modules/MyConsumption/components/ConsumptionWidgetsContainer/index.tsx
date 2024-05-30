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
import { WidgetCost } from 'src/modules/MyConsumption/components/WidgetCost'
import { useMyConsumptionStore } from 'src/modules/MyConsumption/store/myConsumptionStore'
import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'

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
 * @param props.isIdleWidgetShown Boolean indicating whether the idle widget is shown or not.
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
    isIdleWidgetShown,
}: ConsumptionWidgetsContainerProps) => {
    const theme = useTheme()
    const { resetMetricsWidgetData } = useContext(ConsumptionWidgetsMetricsContext)
    const { currentHousingScopes } = useSelector(({ housingModel }: RootState) => housingModel)
    const { consumptionToggleButton } = useMyConsumptionStore()

    const isAutoconsmptionProductionToggled =
        consumptionToggleButton === SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction
    const isProductionEnabled = useMemo(
        () => isProductionActiveAndHousingHasAccess(currentHousingScopes) && !enphaseOff,
        [currentHousingScopes, enphaseOff],
    )

    const widgetsToRender = useMemo<metricTargetType[]>(() => {
        let widgetsToRender: metricTargetType[] = []

        if (period !== 'daily') {
            // When the period is not daily we show the Pmax widget
            widgetsToRender = [...widgetsToRender, metricTargetsEnum.pMax]
        }

        if (isProductionEnabled && isAutoconsmptionProductionToggled) {
            widgetsToRender = [metricTargetsEnum.totalProduction, metricTargetsEnum.autoconsumption, ...widgetsToRender]
        }

        return widgetsToRender
    }, [isAutoconsmptionProductionToggled, isProductionEnabled, period])

    /**
     *   We should reset the metrics context when the range, filters, metricsInterval or period changes,
     * because we have a completely new metrics when one of those dependencies changes.
     */
    useEffect(() => {
        resetMetricsWidgetData()
    }, [range, filters, metricsInterval, period, resetMetricsWidgetData])

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
                    {isProductionEnabled && isAutoconsmptionProductionToggled ? (
                        <WidgetConsumption
                            targets={[metricTargetsEnum.consumption]}
                            range={range}
                            filters={filters}
                            metricsInterval={metricsInterval}
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
                    ) : (
                        // to keep consumption widget always at the beginning, we render the consumption widget here with the normal widget component instead of ebder it inside the loop
                        <Widget
                            targets={[metricTargetsEnum.consumption]}
                            range={range}
                            filters={filters}
                            metricsInterval={metricsInterval}
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

                    {isIdleWidgetShown && (
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
                    )}

                    <WidgetCost
                        key={metricTargetsEnum.eurosConsumption}
                        targets={[metricTargetsEnum.eurosConsumption]}
                        range={range}
                        filters={filters}
                        metricsInterval={metricsInterval}
                        period={period}
                        infoIcons={{
                            [metricTargetsEnum.eurosConsumption]: getWidgetInfoIcon({
                                widgetTarget: metricTargetsEnum.eurosConsumption,
                                hasMissingContracts: hasMissingHousingContracts,
                                enphaseOff,
                                enedisSgeOff: enedisOff,
                            }),
                        }}
                        enphaseOff={enphaseOff}
                        childrenPosition="bottom"
                    />

                    {/** Display the other targets with Widget Component. */}
                    {widgetsToRender.map((target) => {
                        return target === metricTargetsEnum.totalProduction ? (
                            <Widget
                                key={metricTargetsEnum.totalProduction}
                                targets={[metricTargetsEnum.totalProduction, metricTargetsEnum.injectedProduction]}
                                range={range}
                                filters={filters}
                                metricsInterval={metricsInterval}
                                period={period}
                                infoIcons={{
                                    [metricTargetsEnum.totalProduction]: getWidgetInfoIcon({
                                        widgetTarget: metricTargetsEnum.totalProduction,
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
                                metricsInterval={metricsInterval}
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
