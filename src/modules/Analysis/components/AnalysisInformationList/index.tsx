import { useMemo } from 'react'
import { IMetric, metricRangeType } from 'src/modules/Metrics/Metrics.d'
import { Typography, useTheme } from '@mui/material'
import {
    computeMaxConsumption,
    computeMeanConsumption,
    computeMinConsumption,
} from 'src/modules/Analysis/utils/computationFunctions'
import { analysisInformationName, analysisInformationType } from 'src/modules/Analysis/analysisTypes.d'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { ApexChartsAxisValuesType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { fillApexChartsAxisMissingValues } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
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
        iconPath: '/assets/images/content/analysis/meanConsumption.svg',
        color: 'palette.primary.main',
        computationFunction:
            // eslint-disable-next-line jsdoc/require-jsdoc
            (consumptionAxisValues: ApexChartsAxisValuesType) =>
                computeMeanConsumption(
                    consumptionAxisValues.yAxisSeries.length > 0
                        ? (consumptionAxisValues.yAxisSeries[0].data as Array<number>)
                        : [],
                ),
    },
    {
        title: 'Jour de Conso maximale',
        name: 'maxConsumptionDay',
        color: 'palette.primary.dark',
        iconPath: '/assets/images/content/analysis/maxConsumption.svg',
        computationFunction:
            // eslint-disable-next-line jsdoc/require-jsdoc
            (consumptionAxisValues: ApexChartsAxisValuesType) => computeMaxConsumption(consumptionAxisValues),
    },
    {
        title: 'Jour de Conso minimale',
        name: 'minConsumptionDay',
        color: 'palette.primary.light',
        iconPath: '/assets/images/content/analysis/minConsumption.svg',
        computationFunction:
            // eslint-disable-next-line jsdoc/require-jsdoc
            (consumptionAxisValues: ApexChartsAxisValuesType) => computeMinConsumption(consumptionAxisValues),
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
    // eslint-disable-next-line jsdoc/require-jsdoc
    activeInformationName?: analysisInformationName
}) => {
    const theme = useTheme()

    // Wrap in useMemo for better performance, as we save the result of convertMetricsData function and we don't call it again on every reender, until data changes.
    let ApexChartsAxisValues: ApexChartsAxisValuesType = useMemo(
        () => convertMetricsDataToApexChartsAxisValues(data),
        [data],
    )

    // Wrap in useMemo for better performance, as we save the heavy computational result of fillApexChartsAxisMissingValues function and we don't call it again on every reender, until period, range or ApexChartsAxisValues from convertMetricsDataToApexChartsAxisValues changes.
    // The fillApexChartsAxisMissingValues checks if there are missing axis values.
    ApexChartsAxisValues = useMemo(
        // Because of ApexCharts to show the right amount of xAxis even If there are missing values according to the period (for example for 'weekly' we expect seven values), we fill the missing values with null.
        () => fillApexChartsAxisMissingValues(ApexChartsAxisValues, 'monthly', range),
        [range, ApexChartsAxisValues],
    )

    return (
        <div className="w-full flex flex-col md:items-center">
            {analysisInformationList.map(({ computationFunction, iconPath, title, color, name }, index) => {
                const { unit, value, timestamp } = computationFunction(ApexChartsAxisValues)
                return (
                    <div
                        className="flex flex-row mb-16"
                        style={{
                            // If its active information name, then we put it on top, otherwise we just give index + 2, so that when we have another active information there won't be two 1's which can lead one information at index 1 can be on top of the activeInformation as they have the same order of 1, always 2 3 4 5 ...etc, or 1 2 3 4 5 ...etc.
                            order: activeInformationName && activeInformationName === name ? 1 : index + 2,
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
                            {value ? (
                                <>
                                    {/* Analysis Information Day */}
                                    {timestamp ? (
                                        <Typography className="sm:text-13 font-medium md:text-16">
                                            {dayjs(new Date(timestamp)).format('dddd DD')}
                                        </Typography>
                                    ) : (
                                        <></>
                                    )}
                                    {/* Analysis Information Value Unit */}
                                    <Typography className="sm:text-13 font-medium md:text-16">
                                        {value} {unit}
                                    </Typography>
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
