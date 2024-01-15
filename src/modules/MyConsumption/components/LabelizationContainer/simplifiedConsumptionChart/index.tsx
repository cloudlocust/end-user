import { CircularProgress } from '@mui/material'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { useTheme } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IMetric, metricTargetType } from 'src/modules/Metrics/Metrics'
import { filterMetricsData, getDefaultConsumptionTargets } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import MyConsumptionDatePicker from 'src/modules/MyConsumption/components/MyConsumptionDatePicker'
import ConsumptionLabelCard from 'src/modules/MyConsumption/components/LabelizationContainer/ConsumptionLabelCard'
import {
    ConsumptionLabelDataType,
    SimplifiedConsumptionChartContainerPropsType,
} from 'src/modules/MyConsumption/components/LabelizationContainer/labelizaitonTypes.d'
import { IPeriodTime } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
import { ConsumptionEnedisSgeWarning } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartWarnings'
import { sgeConsentFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import ReactECharts from 'echarts-for-react'
import AddLabelButtonForm from 'src/modules/MyConsumption/components/LabelizationContainer/AddLabelButtonForm'

/**
 * MyConsumptionChartContainer Component.
 *
 * @param props N/A.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @param props.metricsInterval Boolean state to know whether the stacked option is true or false.
 * @param props.filters Consumption or production chart type.
 * @param props.isSolarProductionConsentOff Boolean indicating if solar production consent is off.
 * @param props.enedisSgeConsent Enedis SGE Consent.
 * @param props.setRange Set Range.
 * @returns MyConsumptionChartContainer Component.
 */
const SimplifiedConsumptionChartContainer = ({
    range,
    metricsInterval,
    filters,
    isSolarProductionConsentOff,
    enedisSgeConsent,
    setRange,
}: SimplifiedConsumptionChartContainerPropsType) => {
    const theme = useTheme()
    // Handling the targets makes it simpler instead of the useMetrics as it's a straightforward array of metricTargetType
    // Meanwhile the setTargets for useMetrics needs to add {type: 'timeserie'} everytime...
    const [targets, setTargets] = useState<metricTargetType[]>(
        getDefaultConsumptionTargets(isSolarProductionConsentOff),
    )
    const period = PeriodEnum.DAILY
    const chartRef = useRef<ReactECharts>(null)

    // Indicates if enedisSgeConsent is not Connected
    const enedisSgeOff = enedisSgeConsent?.enedisSgeConsentState !== 'CONNECTED'

    const { data, getMetricsWithParams, isMetricsLoading } = useMetrics({
        interval: metricsInterval,
        range: range,
        targets: [],
        filters,
    })

    const [consumptionChartData, setConsumptionChartData] = useState<IMetric[]>(data)

    // When switching to period daily, if Euros Charts or Idle charts buttons are selected, metrics should be reset.
    // This useEffect reset metrics.
    useEffect(() => {
        setTargets(getDefaultConsumptionTargets(isSolarProductionConsentOff))
    }, [isSolarProductionConsentOff])

    const getMetrics = useCallback(async () => {
        await getMetricsWithParams({ interval: metricsInterval, range, targets, filters })
    }, [getMetricsWithParams, metricsInterval, range, targets, filters])

    // Happens everytime getMetrics dependencies change, and doesn't execute when hook is instanciated.
    useEffect(() => {
        getMetrics()
    }, [getMetrics])

    // To avoid multiple rerendering and thus calculation in MyConsumptionChart, CosnumptionChartData change only once, when targets change or when the first getMetrics targets is loaded, thus avoiding to rerender when the second getMetrics is loaded with all targets which should only happen in the background.
    useEffect(() => {
        if (data.length > 0) {
            let chartData = data
            const fileteredMetricsData = filterMetricsData(chartData, period, isSolarProductionConsentOff)
            if (fileteredMetricsData) chartData = fileteredMetricsData
            setConsumptionChartData(chartData)
        } else {
            setConsumptionChartData(data)
        }
        // Only use data & targets as dependencies.
        // TODO REMOVE this exhausitve-deps due to filteredMetricsData
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, targets])

    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)
    const [selectedLabelData, setSelectedLabelData] = useState<ConsumptionLabelDataType | undefined>(undefined)
    const [selectedPeriod, setSelectedPeriod] = useState<IPeriodTime>({ startTime: undefined, endTime: undefined })
    const [inputPeriodTime, setInputPeriodTime] = useState<IPeriodTime>({ startTime: undefined, endTime: undefined })
    /**
     * Handle card click.
     *
     * @param cardIndex Index of the card.
     * @param labelData Consumption label data.
     */
    const handleCardClick = (cardIndex: number, labelData: ConsumptionLabelDataType) => {
        if (cardIndex === selectedCardIndex) {
            setSelectedCardIndex(null)
            setSelectedLabelData(undefined)
        } else {
            setSelectedCardIndex(cardIndex)
            const startTime = labelData.startTime.split('T')[1].split('.')[0]
            const endTime = labelData.endTime.split('T')[1].split('.')[0]
            setSelectedLabelData({
                ...labelData,
                startTime: `${startTime.split(':')[0]}:${startTime.split(':')[1]}`,
                endTime: `${endTime.split(':')[0]}:${endTime.split(':')[1]}`,
            })
        }
    }

    useEffect(() => {
        const startTime = selectedLabelData?.startTime
        const endTime = selectedLabelData?.endTime
        setSelectedPeriod({ startTime, endTime })
    }, [selectedLabelData])

    const RANDOM_DATE = '2022-11-19'
    const labelsDataExample: ConsumptionLabelDataType[] = [
        {
            id: 1,
            name: 'Label 1',
            startTime: `${RANDOM_DATE}T08:00:00.000Z`,
            endTime: `${RANDOM_DATE}T09:00:00.000Z`,
            consumption: 2,
            price: 3,
        },
        {
            id: 2,
            name: 'Label 2',
            startTime: `${RANDOM_DATE}T10:00:00.000Z`,
            endTime: `${RANDOM_DATE}T11:00:00.000Z`,
            consumption: 2,
            price: 3,
        },
        {
            id: 3,
            name: 'Label 3',
            startTime: `${RANDOM_DATE}T12:00:00.000Z`,
            endTime: `${RANDOM_DATE}T13:00:00.000Z`,
            consumption: 2,
            price: 3,
        },
        {
            id: 4,
            name: 'Label 4',
            startTime: `${RANDOM_DATE}T14:00:00.000Z`,
            endTime: `${RANDOM_DATE}T15:00:00.000Z`,
            consumption: 2,
            price: 3,
        },
        {
            id: 5,
            name: 'Label 1',
            startTime: `${RANDOM_DATE}T08:00:00.000Z`,
            endTime: `${RANDOM_DATE}T09:00:00.000Z`,
            consumption: 2,
            price: 3,
        },
        {
            id: 6,
            name: 'Label 2',
            startTime: `${RANDOM_DATE}T10:00:00.000Z`,
            endTime: `${RANDOM_DATE}T11:00:00.000Z`,
            consumption: 2,
            price: 3,
        },
        {
            id: 7,
            name: 'Label 3',
            startTime: `${RANDOM_DATE}T12:00:00.000Z`,
            endTime: `${RANDOM_DATE}T13:00:00.000Z`,
            consumption: 2,
            price: 3,
        },
        {
            id: 8,
            name: 'Label 4',
            startTime: `${RANDOM_DATE}T14:00:00.000Z`,
            endTime: `${RANDOM_DATE}T15:00:00.000Z`,
            consumption: 2,
            price: 3,
        },
    ]
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
            <div className="flex flex-row justify-end mx-10">
                <AddLabelButtonForm
                    color={`${theme.palette.secondary.main}`}
                    chartRef={chartRef}
                    inputPeriodTime={inputPeriodTime}
                />
            </div>
            <div>
                {isMetricsLoading ? (
                    <div
                        className="flex h-full w-full flex-col items-center justify-center"
                        style={{ height: '320px' }}
                    >
                        <CircularProgress style={{ color: theme.palette.primary.main }} />
                    </div>
                ) : (
                    <>
                        <MyConsumptionChart
                            data={consumptionChartData}
                            period={period}
                            isSolarProductionConsentOff={isSolarProductionConsentOff}
                            axisColor={theme.palette.common.black}
                            selectedLabelPeriod={selectedPeriod}
                            chartRef={chartRef}
                            setInputPeriodTime={setInputPeriodTime}
                        />
                        <ConsumptionEnedisSgeWarning isShowWarning={enedisSgeOff && sgeConsentFeatureState} />

                        <div className="flex h-96 items-center overflow-x-auto whitespace-nowrap m-0 h-200">
                            {labelsDataExample.map((labelData, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer cursor-pointer transition-transform transform ${
                                        selectedCardIndex === index ? 'scale-110' : 'scale-100'
                                    }`}
                                    onClick={() => handleCardClick(index, labelData)}
                                >
                                    <ConsumptionLabelCard labelData={labelData} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default SimplifiedConsumptionChartContainer
