import { useCallback, useEffect, useState } from 'react'
import { useTheme, styled } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import convert, { Unit } from 'convert-units'
import { useConsumptionAlerts } from 'src/modules/Alerts/components/ConsumptionAlert/consumptionAlertHooks'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { formatMetricFilter, getRangeV2 } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'
import { computeWidgetAssets } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { AlertWidget } from 'src/modules/Dashboard/AlertWidgetsContainer/AlertWidget'
import { AlertPeriodEnum, AlertTypeEnum } from 'src/modules/Dashboard/AlertWidgetsContainer/AlertWidget/AlertWidget.d'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import 'swiper/components/scrollbar/scrollbar.scss'
import {
    alertPeriods,
    alertPeriodsArray,
    convertAlertPeriodEnumToPeriodEnum,
    emptyConsumptionValueUnit,
} from 'src/modules/Dashboard/AlertWidgetsContainer/utils'

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

/**
 * Wrapper for the alert widgets.
 *
 * @returns Alert widgets JSX.
 */
export const AlertWidgetsContainer = () => {
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

    /**
     * Function to calculate the total consumption value state for every period.
     */
    const calculateCurrentTotalConsumptions = useCallback(async () => {
        if (consumptionAlerts.length > 0) {
            const totalConsumptiosPromises = alertPeriodsArray.map(async (alertPeriod) => {
                /**
                 * We always need to calculate daily consumption because we need it to calculate
                 * weekly and monthly consumption (in weekly and monthly consumption, we don't get
                 * consumption for the current day, so we need to add daily consumption to them).
                 *
                 * For the weekly and monthly consumption we only need to calculate them if there
                 * is an alert for them.
                 */
                if (
                    alertPeriod === AlertPeriodEnum.DAILY ||
                    consumptionAlerts.find((alert) => alertPeriods[alert.interval] === alertPeriod)
                ) {
                    const consumptionData = await getMetricsWithParams(
                        {
                            interval: alertPeriod === AlertPeriodEnum.DAILY ? '1m' : '1d',
                            range: getRangeV2(convertAlertPeriodEnumToPeriodEnum(alertPeriod)),
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
            })

            // Get an array of 3 elements, each one is an object with the total consumption value for a period.
            const totalConsumptiosPromisesResults = await Promise.all(totalConsumptiosPromises)

            // Join the consumption values for every period in a single object.
            const totalConsumptions = {
                ...totalConsumptiosPromisesResults[0],
                ...totalConsumptiosPromisesResults[1],
                ...totalConsumptiosPromisesResults[2],
            }

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
        calculateCurrentTotalConsumptions()
    }, [calculateCurrentTotalConsumptions])

    return (
        <FuseCard
            sx={{ height: isAlertsLoadingInProgress || isMetricsLoading ? 290 : '100%' }}
            isLoading={isAlertsLoadingInProgress || isMetricsLoading}
            loadingColor={theme.palette.primary.main}
            className="p-20 flex flex-grow"
        >
            <StyledSwiper spaceBetween={20} slidesPerView={1} pagination={{ clickable: true }} navigation>
                {alertPeriodsArray.map((alertPeriod) => {
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
