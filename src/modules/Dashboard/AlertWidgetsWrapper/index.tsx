import { AlertWidget } from 'src/modules/Dashboard/AlertWidgetsWrapper/AlertWidget'
import { AlertPeriodEnum, AlertTypeEnum } from 'src/modules/Dashboard/AlertWidgetsWrapper/AlertWidget/AlertWidget.d'
import { useTheme, styled } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import 'swiper/components/scrollbar/scrollbar.scss'
import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'
import { useConsumptionAlerts } from 'src/modules/Alerts/components/ConsumptionAlert/consumptionAlertHooks'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { useCallback, useEffect, useState } from 'react'
import { formatMetricFilter, getRangeV2 } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { computeWidgetAssets } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import convert, { Unit } from 'convert-units'

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

const StyledSwiper = styled(Swiper)(({ theme }) => ({
    '& .swiper-button-prev, & .swiper-button-next': {
        color: theme.palette.primary.main,
        transform: 'scale(0.6)',
    },
    '& .swiper-pagination-bullet-active': {
        backgroundColor: theme.palette.primary.main,
    },
    '& .swiper-pagination': {
        bottom: '0 !important',
        transform: 'scale(0.7)',
    },
}))

const emptyConsumptionValueUnit = { value: 0, unit: 'Wh' }

const alertPeriods = {
    day: AlertPeriodEnum.DAILY,
    week: AlertPeriodEnum.WEEKLY,
    month: AlertPeriodEnum.MONTHLY,
}

/**
 * Wrapper for the alert widgets.
 *
 * @returns Alert widgets JSX.
 */
export const AlertWidgetsWrapper = () => {
    const theme = useTheme()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { consumptionAlerts, isAlertsLoadingInProgress } = useConsumptionAlerts(currentHousing?.id ?? null)
    const { getMetricsWithParams, isMetricsLoading } = useMetrics()
    const [currentTotalConsumptionValues, setCurrentTotalConsumptionValues] = useState<Record<AlertPeriodEnum, number>>(
        {
            [AlertPeriodEnum.DAILY]: 0,
            [AlertPeriodEnum.WEEKLY]: 0,
            [AlertPeriodEnum.MONTHLY]: 0,
        },
    )

    const updateCurrentTotalConsumptionValues = useCallback(async () => {
        if (consumptionAlerts.length > 0) {
            const promises = [AlertPeriodEnum.DAILY, AlertPeriodEnum.WEEKLY, AlertPeriodEnum.MONTHLY].map(
                async (alertPeriod) => {
                    if (
                        alertPeriod === AlertPeriodEnum.DAILY ||
                        consumptionAlerts.find((alert) => alertPeriods[alert.interval] === alertPeriod)
                    ) {
                        const consumptionData = await getMetricsWithParams(
                            {
                                interval: alertPeriod === AlertPeriodEnum.DAILY ? '1m' : '1d',
                                range: getRangeV2(alertPeriod as any),
                                targets: [metricTargetsEnum.consumption],
                                filters: formatMetricFilter(currentHousing!.id) ?? [],
                            },
                            false,
                        )
                        const { value: totalConsumptionValue, unit: totalConsumptionUnit } = !consumptionData?.length
                            ? emptyConsumptionValueUnit
                            : computeWidgetAssets(consumptionData, metricTargetsEnum.consumption)
                        return {
                            [alertPeriod]: Number(
                                convert(totalConsumptionValue as number)
                                    .from(totalConsumptionUnit as Unit)
                                    .to('Wh'),
                            ),
                        }
                    }
                    return {
                        [alertPeriod]: 0,
                    }
                },
            )
            const results = await Promise.all(promises)
            const totalConsumptions = { ...results[0], ...results[1], ...results[2] }
            setCurrentTotalConsumptionValues({
                [AlertPeriodEnum.DAILY]: totalConsumptions[AlertPeriodEnum.DAILY],
                [AlertPeriodEnum.WEEKLY]:
                    totalConsumptions[AlertPeriodEnum.WEEKLY] + totalConsumptions[AlertPeriodEnum.DAILY],
                [AlertPeriodEnum.MONTHLY]:
                    totalConsumptions[AlertPeriodEnum.MONTHLY] + totalConsumptions[AlertPeriodEnum.DAILY],
            })
        }
    }, [consumptionAlerts, currentHousing, getMetricsWithParams])

    useEffect(() => {
        updateCurrentTotalConsumptionValues()
    }, [updateCurrentTotalConsumptionValues])

    return (
        <FuseCard isLoading={isAlertsLoadingInProgress || isMetricsLoading} loadingColor={theme.palette.primary.main}>
            <StyledSwiper spaceBetween={20} slidesPerView={1} pagination={{ clickable: true }} navigation>
                {[AlertPeriodEnum.DAILY, AlertPeriodEnum.WEEKLY, AlertPeriodEnum.MONTHLY].map((alertPeriod) => {
                    const alertData = consumptionAlerts.find((alert) => alertPeriods[alert.interval] === alertPeriod)
                    return (
                        <SwiperSlide key={alertPeriod}>
                            <AlertWidget
                                alertPeriod={alertPeriod}
                                alertType={AlertTypeEnum.CONSUMPTION}
                                currentValue={currentTotalConsumptionValues[alertPeriod]}
                                alertThreshold={alertData?.consumption ? alertData?.consumption * 1000 : undefined}
                            />
                        </SwiperSlide>
                    )
                })}
            </StyledSwiper>
        </FuseCard>
    )
}
