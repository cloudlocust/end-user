import { Button, CircularProgress, Icon } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { motion } from 'framer-motion'
import { Add as AddIcon } from '@mui/icons-material'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { useTheme } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import {
    IMetric,
    metricFiltersType,
    metricIntervalType,
    metricRangeType,
    metricTargetType,
} from 'src/modules/Metrics/Metrics'
import { filterMetricsData, getDefaultConsumptionTargets } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import MyConsumptionDatePicker from 'src/modules/MyConsumption/components/MyConsumptionDatePicker'
import { useHistory } from 'react-router-dom'
import ConsumptionLabelCard from '../ConsumptionLabelCard'
import { ConsumptionLabelDataType } from 'src/modules/MyConsumption/components/LabelizationContainer/labelizaitonTypes.d'
import { IPeriodTime } from '../../MyConsumptionChart/MyConsumptionChartTypes.d'

/**
 * MyConsumptionChartContainer Component.
 *
 * @param props N/A.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @param props.metricsInterval Boolean state to know whether the stacked option is true or false.
 * @param props.filters Consumption or production chart type.
 * @param props.isSolarProductionConsentOff Boolean indicating if solar production consent is off.
 * @param props.setRange Set Range.
 * @returns MyConsumptionChartContainer Component.
 */
const SimplifiedConsumptionChartContainer = ({
    range,
    metricsInterval,
    filters,
    isSolarProductionConsentOff,
    setRange,
}: /**
 */
{
    /**
     * Range.
     */
    range: metricRangeType
    /**
     * Metrics interval.
     */
    metricsInterval: metricIntervalType
    /**
     * Filters.
     */
    filters: metricFiltersType
    /**
     * Is production consent off.
     */
    isSolarProductionConsentOff: boolean
    /**
     * Set Range.
     */
    setRange: (range: metricRangeType) => void
}) => {
    const theme = useTheme()
    const history = useHistory()
    // Handling the targets makes it simpler instead of the useMetrics as it's a straightforward array of metricTargetType
    // Meanwhile the setTargets for useMetrics needs to add {type: 'timeserie'} everytime...
    const [targets, setTargets] = useState<metricTargetType[]>(
        getDefaultConsumptionTargets(isSolarProductionConsentOff),
    )
    const period = PeriodEnum.DAILY

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
            setSelectedLabelData(labelData)
        }
    }

    useEffect(() => {
        const startTime = selectedLabelData?.startTime
        const endTime = selectedLabelData?.endTime
        setSelectedPeriod({ startTime, endTime })
    }, [selectedLabelData])

    const RANDOM_DATE = '2022-11-19T00:00:00.000Z'
    const labelsDataExample: ConsumptionLabelDataType[] = [
        {
            id: 1,
            name: 'Label 1',
            startTime: '08:00',
            endTime: '09:00',
            consumption: 2,
            price: 3,
            date: RANDOM_DATE,
        },
        {
            id: 2,
            name: 'Label 2',
            startTime: '10:00',
            endTime: '11:00',
            consumption: 2,
            price: 3,
            date: RANDOM_DATE,
        },
        {
            id: 3,
            name: 'Label 3',
            startTime: '12:00',
            endTime: '13:00',
            consumption: 2,
            price: 3,
            date: RANDOM_DATE,
        },
        {
            id: 4,
            name: 'Label 4',
            startTime: '14:00',
            endTime: '15:00',
            consumption: 2,
            price: 3,
            date: RANDOM_DATE,
        },
        {
            id: 5,
            name: 'Label 1',
            startTime: '08:00',
            endTime: '09:00',
            consumption: 2,
            price: 3,
            date: RANDOM_DATE,
        },
        {
            id: 6,
            name: 'Label 2',
            startTime: '10:00',
            endTime: '11:00',
            consumption: 2,
            price: 3,
            date: RANDOM_DATE,
        },
        {
            id: 7,
            name: 'Label 3',
            startTime: '12:00',
            endTime: '13:00',
            consumption: 2,
            price: 3,
            date: RANDOM_DATE,
        },
        {
            id: 8,
            name: 'Label 4',
            startTime: '14:00',
            endTime: '15:00',
            consumption: 2,
            price: 3,
            date: RANDOM_DATE,
        },
    ]
    return (
        <div className="flex flex-col justify-center my-20">
            <div className="flex flex-row justify-between align-center mx-20">
                <Button className="flex justify-center items-center" variant="text" onClick={() => history.goBack()}>
                    <Icon sx={{ color: theme.palette.primary.main }}>arrow_back</Icon>
                    <TypographyFormatMessage sx={{ color: theme.palette.primary.main }} className="text-16 font-medium">
                        Retour
                    </TypographyFormatMessage>
                </Button>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}>
                    <Button
                        className="whitespace-nowrap"
                        variant="contained"
                        color="secondary"
                        sx={{
                            '&:hover': {
                                backgroundColor: `${theme.palette.secondary.main}`,
                                opacity: '.7',
                            },
                        }}
                    >
                        <span className="hidden sm:flex">
                            <TypographyFormatMessage>Ajouter un label</TypographyFormatMessage>
                        </span>
                        <span className="flex sm:hidden">
                            <AddIcon />
                        </span>
                    </Button>
                </motion.div>
            </div>
            <div>
                <MyConsumptionDatePicker
                    period={period}
                    setRange={setRange}
                    range={range}
                    color={theme.palette.primary.main}
                />
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
                        />
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
