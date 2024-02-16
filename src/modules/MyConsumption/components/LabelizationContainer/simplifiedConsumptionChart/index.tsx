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
import MyConsumptionDatePicker from 'src/modules/MyConsumption/components/MyConsumptionDatePicker'
import ConsumptionLabelCard from 'src/modules/MyConsumption/components/LabelizationContainer/ConsumptionLabelCard'
import { mappingEquipmentNameToType, myEquipmentOptions } from 'src/modules/MyHouse/utils/MyHouseVariables'
import {
    ConsumptionLabelDataType,
    SimplifiedConsumptionChartContainerPropsType,
} from 'src/modules/MyConsumption/components/LabelizationContainer/labelizaitonTypes.d'
import { IPeriodTime } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
import ReactECharts from 'echarts-for-react'
import AddLabelButtonForm from 'src/modules/MyConsumption/components/LabelizationContainer/AddLabelButtonForm'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useEquipmentList } from 'src/modules/MyHouse/components/Installation/installationHook'
import { equipmentNameType } from 'src/modules/MyHouse/components/Installation/InstallationType'
import { useMyConsumptionStore } from 'src/modules/MyConsumption/store/myConsumptionStore'

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
    const { housingEquipmentsList, loadingEquipmentInProgress } = useEquipmentList(currentHousing?.id)

    const [consumptionChartData, setConsumptionChartData] = useState<IMetric[]>(data)

    // When switching to period daily, if Euros Charts or Idle charts buttons are selected, metrics should be reset.
    // This useEffect reset metrics.
    useEffect(() => {
        setTargets(getDefaultConsumptionTargets(consumptionToggleButton))
    }, [consumptionToggleButton])

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
            const fileteredMetricsData = filterMetricsData(chartData, period, consumptionToggleButton)
            if (fileteredMetricsData) chartData = fileteredMetricsData
            setConsumptionChartData(chartData)
        } else {
            setConsumptionChartData(data)
        }
        // Only use data & targets as dependencies.
        // TODO REMOVE this exhausitve-deps due to filteredMetricsData
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, targets])

    const [consumptionLabelCardsData, setConsumptionLabelCardsData] = useState<ConsumptionLabelCardProps[]>([])
    const [selectedLabelData, setSelectedLabelData] = useState<ConsumptionLabelCardProps | undefined>(undefined)
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)
    const [selectedPeriod, setSelectedPeriod] = useState<IPeriodTime>({ startTime: undefined, endTime: undefined })
    const [inputPeriodTime, setInputPeriodTime] = useState<IPeriodTime>({ startTime: undefined, endTime: undefined })
    /**
     * Handle card click.
     *
     * @param cardIndex Index of the card.
     * @param labelData Consumption label data.
     */
    const handleCardClick = (cardIndex: number, labelData: ConsumptionLabelCardProps) => {
        if (cardIndex === selectedCardIndex) {
            setSelectedCardIndex(null)
            setSelectedLabelData(undefined)
        } else {
            setSelectedCardIndex(cardIndex)
            setSelectedLabelData({ ...labelData })
        }
    }

    useEffect(() => {
        const startTime = selectedLabelData?.startTime
        const endTime = selectedLabelData?.endTime
        setSelectedPeriod({ startTime, endTime })
    }, [selectedLabelData])

    useEffect(() => {
        const RANDOM_DATE = '2022-11-19'
        const labelsDataExample: ConsumptionLabelDataType[] = [
            {
                id: 1,
                startDate: `${RANDOM_DATE}T08:00:00.000Z`,
                endDate: `${RANDOM_DATE}T09:00:00.000Z`,
                consumption: 2,
                consumptionPrice: 3,
                useType: 'standard',
                housingEquipment: {
                    equipmentId: 6,
                    equipmentType: 'electricity',
                    equipmentNumber: 1,
                    id: 93,
                    equipment: {
                        id: 6,
                        name: 'microwave',
                        allowedType: ['electricity'],
                        customerId: null,
                        measurementDuration: '2m',
                        measurementModes: ['Standard', 'Grill'],
                    },
                },
            },
            {
                id: 2,
                startDate: `${RANDOM_DATE}T10:00:00.000Z`,
                endDate: `${RANDOM_DATE}T11:00:00.000Z`,
                consumption: 5,
                consumptionPrice: 13,
                useType: null,
                housingEquipment: {
                    equipmentId: 7,
                    equipmentType: 'electricity',
                    equipmentNumber: 1,
                    id: 177,
                    equipment: {
                        id: 7,
                        name: 'fridge',
                        allowedType: ['electricity'],
                        customerId: null,
                        measurementDuration: null,
                        measurementModes: null,
                    },
                },
            },
            {
                id: 3,
                startDate: `${RANDOM_DATE}T08:00:00.000Z`,
                endDate: `${RANDOM_DATE}T09:00:00.000Z`,
                consumption: 2,
                consumptionPrice: 3,
                useType: 'Hello world !!!',
                housingEquipment: {
                    equipmentId: 6,
                    equipmentType: 'electricity',
                    equipmentNumber: 1,
                    id: 93,
                    equipment: {
                        id: 6,
                        name: 'microwave',
                        allowedType: ['electricity'],
                        customerId: null,
                        measurementDuration: '2m',
                        measurementModes: ['Standard', 'Grill'],
                    },
                },
            },
            {
                id: 4,
                startDate: `${RANDOM_DATE}T10:00:00.000Z`,
                endDate: `${RANDOM_DATE}T11:00:00.000Z`,
                consumption: 5,
                consumptionPrice: 13,
                useType: null,
                housingEquipment: {
                    equipmentId: 7,
                    equipmentType: 'electricity',
                    equipmentNumber: 1,
                    id: 177,
                    equipment: {
                        id: 7,
                        name: 'fridge',
                        allowedType: ['electricity'],
                        customerId: null,
                        measurementDuration: null,
                        measurementModes: null,
                    },
                },
            },
            {
                id: 5,
                startDate: `${RANDOM_DATE}T08:00:00.000Z`,
                endDate: `${RANDOM_DATE}T09:00:00.000Z`,
                consumption: 2,
                consumptionPrice: 3,
                useType: 'This is an example for the use type of a label',
                housingEquipment: {
                    equipmentId: 6,
                    equipmentType: 'electricity',
                    equipmentNumber: 1,
                    id: 93,
                    equipment: {
                        id: 6,
                        name: 'microwave',
                        allowedType: ['electricity'],
                        customerId: null,
                        measurementDuration: '2m',
                        measurementModes: ['Standard', 'Grill'],
                    },
                },
            },
            {
                id: 6,
                startDate: `${RANDOM_DATE}T10:00:00.000Z`,
                endDate: `${RANDOM_DATE}T11:00:00.000Z`,
                consumption: 5,
                consumptionPrice: 13,
                useType: null,
                housingEquipment: {
                    equipmentId: 7,
                    equipmentType: 'electricity',
                    equipmentNumber: 1,
                    id: 177,
                    equipment: {
                        id: 7,
                        name: 'fridge',
                        allowedType: ['electricity'],
                        customerId: null,
                        measurementDuration: null,
                        measurementModes: null,
                    },
                },
            },
        ]

        setConsumptionLabelCardsData(
            labelsDataExample.map((labelData) => {
                const [hourStartTime, minutStartTime] = labelData.startDate
                    .split('T')[1]
                    .split('.')[0]
                    .split(':')
                    .slice(0, 2)
                const [hourEndTime, minutEndTime] = labelData.endDate.split('T')[1].split('.')[0].split(':').slice(0, 2)

                return {
                    equipmentName:
                        myEquipmentOptions.find((option) => option.name === labelData.housingEquipment.equipment.name)
                            ?.labelTitle || labelData.housingEquipment.equipment.name,
                    day: labelData.startDate.split('T')[0],
                    startTime: `${hourStartTime}:${minutStartTime}`,
                    endTime: `${hourEndTime}:${minutEndTime}`,
                    consumption: labelData.consumption,
                    consumptionPrice: labelData.consumptionPrice,
                    useType: labelData.useType,
                }
            }),
        )
    }, [])

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
            <AddLabelButtonForm
                chartRef={chartRef}
                inputPeriodTime={inputPeriodTime}
                setInputPeriodTime={setInputPeriodTime}
                equipments={
                    housingEquipmentsList
                        ?.filter(
                            (housingEquipment) =>
                                housingEquipment.equipmentNumber &&
                                (mappingEquipmentNameToType[housingEquipment.equipment.name as equipmentNameType] ===
                                    'number' ||
                                    housingEquipment.equipment.customerId),
                        )
                        .map((housingEquipment) => {
                            const equipmentOption = myEquipmentOptions.find(
                                (option) => option.name === housingEquipment.equipment.name,
                            )
                            return {
                                id: housingEquipment.id,
                                name: equipmentOption?.labelTitle || housingEquipment.equipment.name,
                            }
                        }) ?? []
                }
                loadingEquipmentsInProgress={loadingEquipmentInProgress}
                addNewLabel={() => {}}
            />
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
                            axisColor={theme.palette.common.black}
                            selectedLabelPeriod={selectedPeriod}
                            chartRef={chartRef}
                            setInputPeriodTime={setInputPeriodTime}
                        />
                        <div className="mx-32 mt-32">
                            <TypographyFormatMessage variant="h2" fontSize="25px" fontWeight="500">
                                Mes étiquettes
                            </TypographyFormatMessage>
                            <div className="grid gap-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-24">
                                {consumptionLabelCardsData.map((labelData, index) => (
                                    <div
                                        key={index}
                                        className={`cursor-pointer transition-transform transform ${
                                            selectedCardIndex === index ? 'scale-105' : 'scale-100'
                                        }`}
                                        onClick={() => handleCardClick(index, labelData)}
                                    >
                                        <ConsumptionLabelCard {...labelData} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default SimplifiedConsumptionChartContainer
