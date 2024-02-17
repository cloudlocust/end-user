import { useMemo } from 'react'
import { IMetric, metricRangeType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { Typography, useTheme } from '@mui/material'
import {
    computeMaxConsumption,
    computeMeanConsumption,
    computeMinConsumption,
    computeStatisticsMetricsTargetData,
} from 'src/modules/Analysis/utils/computationFunctions'
import { analysisInformationName, analysisInformationType } from 'src/modules/Analysis/analysisTypes.d'
import { convertMetricsDataToChartsAxisValues } from 'src/modules/MyConsumption/utils/chartsDataConverter'
import { ChartsAxisValuesType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { fillChartsAxisMissingValues } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import Avatar from '@mui/material/Avatar'
import dayjs from 'dayjs'
import { get } from 'lodash'
/**
 * Function that returns title according to metric target.
 *
 * @param target Metric Target.
 * @returns Widget title.
 */
const analysisInformationList: analysisInformationType[] = [
    {
        title: 'Conso moyenne par jour',
        name: 'meanConsumption',
        iconPath: './assets/images/content/analysis/meanConsumption.svg',
        color: 'palette.primary.main',
        // eslint-disable-next-line jsdoc/require-jsdoc
        computeConsumption: (consumptionAxisValues: ChartsAxisValuesType) =>
            computeMeanConsumption(consumptionAxisValues),
        // eslint-disable-next-line jsdoc/require-jsdoc
        computeEuros: (consumptionAxisValues: ChartsAxisValuesType) =>
            computeStatisticsMetricsTargetData(consumptionAxisValues, metricTargetsEnum.eurosConsumption, 'mean'),
    },
    {
        title: 'Jour de Conso maximale',
        name: 'maxConsumptionDay',
        color: 'palette.primary.dark',
        iconPath: './assets/images/content/analysis/maxConsumption.svg',
        // eslint-disable-next-line jsdoc/require-jsdoc
        computeConsumption: (consumptionAxisValues: ChartsAxisValuesType) =>
            computeMaxConsumption(consumptionAxisValues),
        // eslint-disable-next-line jsdoc/require-jsdoc
        computeEuros: (consumptionAxisValues: ChartsAxisValuesType) =>
            computeStatisticsMetricsTargetData(consumptionAxisValues, metricTargetsEnum.eurosConsumption, 'maximum'),
    },
    {
        title: 'Jour de Conso minimale',
        name: 'minConsumptionDay',
        color: 'palette.primary.light',
        iconPath: './assets/images/content/analysis/minConsumption.svg',
        // eslint-disable-next-line jsdoc/require-jsdoc
        computeConsumption: (consumptionAxisValues: ChartsAxisValuesType) =>
            computeMinConsumption(consumptionAxisValues),
        // eslint-disable-next-line jsdoc/require-jsdoc
        computeEuros: (consumptionAxisValues: ChartsAxisValuesType) =>
            computeStatisticsMetricsTargetData(consumptionAxisValues, metricTargetsEnum.eurosConsumption, 'minimum'),
    },
]

/**
 * Analysis Information List component that shows different analysis interactive information.
 *
 * @param props N/A.
 * @param props.data Metrics data passed as props from parent.
 * @param props.range Range from metricHooks, needed to fill missing values for timestamps.
 * @param props.activeInformationName Represent the active information that is retrieved from analysisChart.
 * @returns Analysis Information List component.
 */
const AnalysisInformationList = ({
    data,
    range,
    activeInformationName,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    /**
     * Date return from metrics request.
     */
    data: IMetric[]
    /**
     * Range from metricHooks, needed to fill missing values for timestamps.
     */
    range: metricRangeType
    /**
     * Active information name that is retrieved from analysisChart.
     */
    activeInformationName?: analysisInformationName
}) => {
    const theme = useTheme()

    // Wrap in useMemo for better performance, as we save the result of convertMetricsData function and we don't call it again on every reender, until data changes.
    let ChartsAxisValues: ChartsAxisValuesType = useMemo(() => convertMetricsDataToChartsAxisValues(data), [data])

    // Wrap in useMemo for better performance, as we save the heavy computational result of fillChartsAxisMissingValues function and we don't call it again on every reender, until period, range or ChartsAxisValues from convertMetricsDataToChartsAxisValues changes.
    // The fillChartsAxisMissingValues checks if there are missing axis values.
    ChartsAxisValues = useMemo(
        // Because of Charts to show the right amount of xAxis even If there are missing values according to the period (for example for 'weekly' we expect seven values), we fill the missing values with null.
        () => fillChartsAxisMissingValues(ChartsAxisValues, 'monthly', range),
        [range, ChartsAxisValues],
    )

    return (
        <div className="w-full flex flex-col md:items-center">
            {analysisInformationList.map(({ computeConsumption, iconPath, title, color, name }, index) => {
                const {
                    unit: consumptionUnit,
                    value: consumptionValue,
                    timestamp,
                } = computeConsumption(ChartsAxisValues)
                // const eurosValue = computeEuros(ChartsAxisValues)
                return (
                    <div
                        className="flex flex-row mb-16"
                        style={{
                            // If its active information name, then we put it on top, otherwise we just give index + 2, so that when we have another active information there won't be two 1's which can lead one information at index 1 can be on top of the activeInformation as they have the same order of 1, always 2 3 4 5 ...etc, or 1 2 3 4 5 ...etc.
                            order: activeInformationName === name ? 1 : index + 2,
                        }}
                    >
                        {/* Analysis Information Icon */}
                        <Avatar
                            style={{
                                backgroundColor: color.startsWith('palette') ? get(theme, color) : color,
                                width: 64,
                                height: 64,
                                // Adding the same styling when selecting an element in analysisChart with filter(150%) and border primary.light.
                                /**
                                 * Border of information, if its active it'll have a borderColor theme.primary.light to highlight it, otherwise the border color is not different and based on the background color.
                                 *
                                 * @returns Border color.
                                 */
                                get border() {
                                    if (activeInformationName === name)
                                        return `3px solid ${theme.palette.primary.light}`
                                    return `3px solid ${this.backgroundColor}`
                                },
                                filter: activeInformationName === name ? 'contrast(150%)' : 'none',
                            }}
                        >
                            <img src={iconPath} alt={title} />
                        </Avatar>
                        <div className="ml-8 flex flex-col h-full">
                            {/* Analysis Information title */}
                            <TypographyFormatMessage className="sm:text-13 font-bold md:text-16">
                                {`${title} : `}
                            </TypographyFormatMessage>
                            {consumptionValue ? (
                                <>
                                    {/* Analysis Information Day */}
                                    {timestamp ? (
                                        <Typography className="sm:text-13 font-medium md:text-16">
                                            {dayjs(new Date(timestamp)).format('dddd DD')}
                                        </Typography>
                                    ) : (
                                        <></>
                                    )}
                                    {/* Analysis Information Consumption Value Unit */}
                                    <Typography className="sm:text-13 font-medium md:text-16">
                                        {consumptionValue} {consumptionUnit}
                                    </Typography>
                                    {/* Analysis Information Euros Value */}
                                    {/* <Typography className="sm:text-13 font-medium md:text-16">
                                        {eurosValue.toFixed(2)} €
                                    </Typography> */}
                                </>
                            ) : (
                                <TypographyFormatMessage className="sm:text-13 font-medium md:text-16">
                                    Aucune donnée disponible
                                </TypographyFormatMessage>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default AnalysisInformationList
