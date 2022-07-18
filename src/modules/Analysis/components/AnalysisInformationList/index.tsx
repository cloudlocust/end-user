import { useMemo } from 'react'
import { IMetric, metricRangeType } from 'src/modules/Metrics/Metrics.d'
import { Typography, useTheme } from '@mui/material'
import { computeMeanConsumption, computeMinConsumption } from 'src/modules/Analysis/utils/computationFunctions'
import { analysisInformationType } from 'src/modules/Analysis/analysisTypes.d'
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
        color: 'palette.primary.dark',
        iconPath: '/assets/images/content/analysis/maxConsumption.svg',
        computationFunction:
            // eslint-disable-next-line jsdoc/require-jsdoc
            (consumptionAxisValues: ApexChartsAxisValuesType) => computeMinConsumption(consumptionAxisValues),
    },
    {
        title: 'Jour de Conso minimale',
        color: 'palette.primary.light',
        iconPath: '/assets/images/content/analysis/meanConsumption.svg',
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
 * @returns Analysis Information List component.
 */
const AnalysisInformationList = ({
    data,
    range,
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
            {analysisInformationList.map(({ computationFunction, iconPath, title, color }) => {
                const { unit, value, timestamp } = computationFunction(ApexChartsAxisValues)
                return (
                    <div className="flex flex-row items-center mb-16">
                        {/* Analysis Information Icon */}
                        <Avatar
                            style={{
                                backgroundColor: (color as string).startsWith('palette')
                                    ? get(theme, color)
                                    : (color as string),
                                width: 56,
                                height: 56,
                            }}
                        >
                            <img src={iconPath} alt={title} />
                        </Avatar>
                        <div className="ml-16 flex flex-col h-full">
                            {/* Analysis Information title */}
                            <TypographyFormatMessage className="sm:text-13 font-bold md:text-16">
                                {`${title} : `}
                            </TypographyFormatMessage>

                            {!value ? (
                                <TypographyFormatMessage
                                    className="sm:text-13 font-medium md:text-16"
                                    color="textSecondary"
                                >
                                    Aucune donnée disponible
                                </TypographyFormatMessage>
                            ) : (
                                <>
                                    {/* Analysis Information Day */}
                                    {timestamp ? (
                                        <Typography className="sm:text-13 font-medium md:text-16" color="textSecondary">
                                            {dayjs(new Date(timestamp!)).format('dddd DD')}
                                        </Typography>
                                    ) : (
                                        <></>
                                    )}
                                    {/* Analysis Information Value Unit */}
                                    <Typography className="sm:text-13 font-medium md:text-16" color="textSecondary">
                                        {value} {unit}
                                    </Typography>
                                </>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default AnalysisInformationList
