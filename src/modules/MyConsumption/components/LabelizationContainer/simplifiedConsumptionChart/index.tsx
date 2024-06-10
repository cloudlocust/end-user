import { CircularProgress } from '@mui/material'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { useTheme } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IMetric, metricTargetType } from 'src/modules/Metrics/Metrics'
import { filterMetricsData, getDefaultConsumptionTargets } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { Form } from 'src/common/react-platform-components'
import MyConsumptionDatePicker from 'src/modules/MyConsumption/components/MyConsumptionDatePicker'
import ConsumptionLabelCard from 'src/modules/MyConsumption/components/LabelizationContainer/ConsumptionLabelCard'
import { equipmentsOptions } from 'src/modules/MyHouse/components/Equipments/EquipmentsVariables'
import {
    SimplifiedConsumptionChartContainerPropsType,
    addActivityFormFieldsType,
    addActivityRequestBodyType,
} from 'src/modules/MyConsumption/components/LabelizationContainer/labelizaitonTypes.types'
import { IPeriodTime } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
import ReactECharts from 'echarts-for-react'
import AddLabelButtonForm from 'src/modules/MyConsumption/components/LabelizationContainer/AddLabelButtonForm'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useLabelization } from 'src/modules/MyConsumption/components/LabelizationContainer/labelizationHook'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { computeWidgetAssets } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import convert, { Unit } from 'convert-units'
import { useMyConsumptionStore } from 'src/modules/MyConsumption/store/myConsumptionStore'
import { LabelCardDataType } from 'src/modules/MyConsumption/components/LabelizationContainer/ConsumptionLabelCard/ConsumptionLabelCard.types'

/**
 * MyConsumptionChartContainer Component.
 *
 * @param props N/A.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @param props.metricsInterval Boolean state to know whether the stacked option is true or false.
 * @param props.filters Consumption or production chart type.
 * @param props.setRange Set Range.
 * @returns MyConsumptionChartContainer Component.
 */
const SimplifiedConsumptionChartContainer = ({
    range,
    metricsInterval,
    filters,
    setRange,
}: SimplifiedConsumptionChartContainerPropsType) => {
    const theme = useTheme()
    const { consumptionToggleButton } = useMyConsumptionStore()
    // Handling the targets makes it simpler instead of the useMetrics as it's a straightforward array of metricTargetType
    // Meanwhile the setTargets for useMetrics needs to add {type: 'timeserie'} everytime...
    const [targets, setTargets] = useState<metricTargetType[]>(getDefaultConsumptionTargets(consumptionToggleButton))
    const period = PeriodEnum.DAILY
    const chartRef = useRef<ReactECharts>(null)

    const { data, getMetricsWithParams, isMetricsLoading } = useMetrics({
        interval: metricsInterval,
        range: range,
        targets: [],
        filters,
    })

    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const {
        activitiesList,
        isGetActivitiesLoading,
        isAddActivityLoading,
        isDeleteActivityLoading,
        getActivitiesList,
        addActivity,
        deleteActivity,
    } = useLabelization(currentHousing?.id)

    useEffect(() => {
        if (!isAddActivityLoading && !isDeleteActivityLoading) {
            getActivitiesList(new Date(range.from))
        }
    }, [getActivitiesList, isAddActivityLoading, isDeleteActivityLoading, range.from])

    const [consumptionChartData, setConsumptionChartData] = useState<IMetric[]>(data)

    // When switching to period daily, if Euros Charts or Idle charts buttons are selected, metrics should be reset.
    // This useEffect reset metrics.
    useEffect(() => {
        setTargets(getDefaultConsumptionTargets(consumptionToggleButton))
    }, [consumptionToggleButton])

    const getMetrics = useCallback(async () => {
        await getMetricsWithParams({
            interval: metricsInterval,
            range,
            targets: [...targets, metricTargetsEnum.eurosConsumption],
            filters,
        })
    }, [getMetricsWithParams, metricsInterval, range, targets, filters])

    // Happens everytime getMetrics dependencies change, and doesn't execute when hook is instanciated.
    useEffect(() => {
        getMetrics()
    }, [getMetrics])

    // To avoid multiple rerendering and thus calculation in MyConsumptionChart, CosnumptionChartData change only once, when targets change or when the first getMetrics targets is loaded, thus avoiding to rerender when the second getMetrics is loaded with all targets which should only happen in the background.
    useEffect(() => {
        const dataWithoutEuros = data.filter((metric) => metric.target !== metricTargetsEnum.eurosConsumption)
        if (dataWithoutEuros.length > 0) {
            let chartData = dataWithoutEuros
            const fileteredMetricsData = filterMetricsData(chartData, period, consumptionToggleButton)
            if (fileteredMetricsData) chartData = fileteredMetricsData
            setConsumptionChartData(chartData)
        } else {
            setConsumptionChartData(dataWithoutEuros)
        }
        // Only use data & targets as dependencies.
        // TODO REMOVE this exhausitve-deps due to filteredMetricsData
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, targets])

    const [consumptionLabelCardsData, setConsumptionLabelCardsData] = useState<LabelCardDataType[]>([])
    const [inputPeriodTime, setInputPeriodTime] = useState<IPeriodTime>({ startTime: undefined, endTime: undefined })

    useEffect(() => {
        if (!isGetActivitiesLoading && activitiesList) {
            setConsumptionLabelCardsData(
                activitiesList.map((activity) => {
                    const [hourStartTime, minutStartTime] = activity.startDate
                        .split('T')[1]
                        .split('.')[0]
                        .split(':')
                        .slice(0, 2)
                    const [hourEndTime, minutEndTime] = activity.endDate
                        .split('T')[1]
                        .split('.')[0]
                        .split(':')
                        .slice(0, 2)
                    return {
                        labelId: activity.id,
                        equipmentName:
                            equipmentsOptions.find((option) => option.name === activity.housingEquipment.equipment.name)
                                ?.labelTitle ?? activity.housingEquipment.equipment.name,
                        day: activity.startDate.split('T')[0],
                        startTime: `${hourStartTime}:${minutStartTime}`,
                        endTime: `${hourEndTime}:${minutEndTime}`,
                        consumption: activity.consumption,
                        consumptionPrice: activity.consumptionPrice,
                        useType: activity.useType,
                    }
                }),
            )
        }
    }, [activitiesList, isGetActivitiesLoading])

    /**
     * Handle the submit of the add label form.
     *
     * @param fieldsValues Form fields values.
     */
    const handleSubmitAddLabelRequest = async (fieldsValues: addActivityFormFieldsType) => {
        const selectedDate = range.from.split('T')[0]
        const startDate = `${selectedDate}T${fieldsValues.startDate}:00.000Z`
        const endDate = `${selectedDate}T${fieldsValues.endDate}:00.000Z`
        const consumptionData = data.find((metric) => metric.target === metricTargetsEnum.consumption)
        const eurosConsumptionData = data.find((metric) => metric.target === metricTargetsEnum.eurosConsumption)
        if (consumptionData && eurosConsumptionData) {
            const startRangeIndex = consumptionData.datapoints.findIndex(
                (datapoint) => datapoint[1] === new Date(startDate).getTime(),
            )
            const endRangeIndex = consumptionData?.datapoints.findIndex(
                (datapoint) => datapoint[1] === new Date(endDate).getTime(),
            )
            const consumptionDataRange: IMetric = {
                target: metricTargetsEnum.consumption,
                datapoints: consumptionData.datapoints.slice(startRangeIndex + 1, endRangeIndex + 1),
            }
            const { value: totalConsumptionValue, unit: totalConsumptionUnit } = computeWidgetAssets(
                [consumptionDataRange],
                metricTargetsEnum.consumption,
            )
            const eurosConsumptionDataRange: IMetric = {
                target: metricTargetsEnum.eurosConsumption,
                datapoints: eurosConsumptionData.datapoints.slice(startRangeIndex + 1, endRangeIndex + 1),
            }
            const { value: totalEurosConsumptionValue } = computeWidgetAssets(
                [eurosConsumptionDataRange],
                metricTargetsEnum.eurosConsumption,
            )
            const requestBody: addActivityRequestBodyType = {
                ...fieldsValues,
                startDate,
                endDate,
                consumption: Number(
                    convert(totalConsumptionValue as number)
                        .from(totalConsumptionUnit as Unit)
                        .to('Wh'),
                ),
                consumptionPrice: Number(totalEurosConsumptionValue),
            }
            try {
                await addActivity(requestBody)
                // To clean the brush selected area
                chartRef.current?.getEchartsInstance()?.dispatchAction({
                    type: 'brush',
                    areas: [],
                })
                // Reset the states
                setInputPeriodTime({
                    startTime: undefined,
                    endTime: undefined,
                })
            } catch (error) {}
        }
    }

    return (
        <div className="flex flex-col justify-center my-20">
            <div className="flex flex-row justify-center align-center">
                <MyConsumptionDatePicker
                    period={period}
                    setRange={setRange}
                    range={range}
                    color={theme.palette.primary.main}
                />
            </div>
            <Form onSubmit={handleSubmitAddLabelRequest}>
                <AddLabelButtonForm
                    chartRef={chartRef}
                    inputPeriodTime={inputPeriodTime}
                    setInputPeriodTime={setInputPeriodTime}
                    isAddingLabelInProgress={isAddActivityLoading}
                    range={range}
                    chartData={consumptionChartData}
                />
            </Form>
            <div>
                {isMetricsLoading ? (
                    <div className="flex w-full items-center justify-center" style={{ height: '360px' }}>
                        <CircularProgress style={{ color: theme.palette.primary.main }} />
                    </div>
                ) : (
                    <MyConsumptionChart
                        data={consumptionChartData}
                        period={period}
                        axisColor={theme.palette.common.black}
                        selectedLabelPeriod={inputPeriodTime}
                        chartRef={chartRef}
                        setInputPeriodTime={setInputPeriodTime}
                        isLabelizationChart
                    />
                )}
                <div className="mx-32 mt-32">
                    <TypographyFormatMessage variant="h2" fontSize="25px" fontWeight="500">
                        Mes étiquettes
                    </TypographyFormatMessage>
                    {isGetActivitiesLoading || isDeleteActivityLoading ? (
                        <div className="flex w-full items-center justify-center" style={{ height: '200px' }}>
                            <CircularProgress style={{ color: theme.palette.primary.main }} />
                        </div>
                    ) : consumptionLabelCardsData.length === 0 ? (
                        <TypographyFormatMessage className="text-18 sm:text-20 font-400 text-grey-400 text-center m-20 mt-60">
                            Aucun label disponible au jour sélectionné
                        </TypographyFormatMessage>
                    ) : (
                        <div className="grid gap-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-24">
                            {consumptionLabelCardsData.map((labelData, index) => (
                                <div key={index}>
                                    <ConsumptionLabelCard labelData={labelData} deleteLabel={deleteActivity} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SimplifiedConsumptionChartContainer
