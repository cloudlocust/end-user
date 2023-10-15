import { DefaultLabelFormatterCallbackParams, EChartsOption } from 'echarts'
import { capitalize, isNull, min, max } from 'lodash'
import dayjs from 'dayjs'
import { Theme } from '@mui/material/styles/createTheme'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Get Echarts Analysis CHart Options.
 *
 * @param values Values of data.
 * @param timeStamps TimeStamps corresponding to values.
 * @param theme Theme used for colors, fonts and backgrounds purposes.
 * @returns Echarts Analysis Option.
 */
export const getEchartsAnalysisChartOptions = (values: ApexNonAxisChartSeries, timeStamps: number[], theme: Theme) => {
    return {
        ...getDefaultOptionsEchartsAnalysisChart(values, theme),
        ...getAngleAxisOptionEchartsAnalysisChart(timeStamps),
        ...getSeriesOptionEchartsAnalysisChart(values, theme),
    } as EChartsOption
}

/**
 * Echarts AnalysisChart Default option.
 *
 * @param values Values to send to chart.
 * @param theme Theme used for colors, fonts and backgrounds.
 * @returns Default EchartsAnalysisChart option.
 */
const getDefaultOptionsEchartsAnalysisChart = (values: (number | null)[], theme: Theme) => {
    return {
        color: 'transparent',
        textStyle: {
            fontFamily: theme.typography.fontFamily,
        },
        tooltip: {
            backgroundColor: theme.palette.primary.main,
            borderColor: 'transparent',
            textStyle: {
                color: theme.palette.primary.contrastText,
            },
            //eslint-disable-next-line
            formatter: (params: DefaultLabelFormatterCallbackParams) => {
                // since we formated the values to show them in the chart, we need to get back the original data value using it's index
                const originalValue = values[params.dataIndex]
                const textDateValue = capitalize(dayjs(new Date(Number(params['name']))).format('ddd DD'))
                const value = isNull(originalValue) ? 0 : originalValue
                let convertedValue = consumptionWattUnitConversion(value)
                return `${textDateValue} - ${convertedValue.value} ${convertedValue.unit}`
            },
        },
        polar: {
            radius: '100%',
        },
        radiusAxis: {
            show: false,
        },
    } as EChartsOption
}

/**
 * Get Angle Axis options for Echarts Analysis Option.
 *
 * @param timestamps Timestamps values.
 * @returns XAxis object option for Echarts Comparaison Options.
 */
export const getAngleAxisOptionEchartsAnalysisChart = (timestamps: number[]) =>
    ({
        angleAxis: {
            type: 'category',
            show: false,
            data: timestamps,
        },
    } as EChartsOption)

/**
 * Get Xaxis option of Echarts Analysis Option.
 *
 * @param values Datapoint values from the echarts metrics conversion function.
 * @param theme Theme used for colors, fonts and backgrounds of xAxis.
 * @returns XAxis object option for Echarts Analysis Options.
 */
export const getSeriesOptionEchartsAnalysisChart = (values: (number | null)[], theme: Theme) => {
    const minValue = min(values)
    const maxValue = max(values)
    /**
     * Function to convert value of the data to be shown with a way that we can still have a good visiual even if we have a div inside of our chart.
     *
     * @param value Singular value of values.
     * @returns Formated Value.
     */
    const mapValueForVisualization = (value: number | null) => {
        if (value && maxValue) {
            const percentageValue = (value * 1000) / maxValue
            return 1000 + percentageValue
        } else return value
    }

    return {
        series: [
            {
                type: 'bar',
                //eslint-disable-next-line
                animationDelay: (idx) => idx * 200, // for having circular effect on upload
                emphasis: {
                    focus: 'series',
                    itemStyle: {
                        borderColor: theme.palette.primary.light,
                        borderWidth: 4,
                    },
                },
                coordinateSystem: 'polar',
                data: values.map(mapValueForVisualization),
                itemStyle: {
                    //eslint-disable-next-line
                    color: (params: DefaultLabelFormatterCallbackParams) => {
                        // since we formated the values to show them in the chart, we need to get back the original data value using it's index
                        const originalValue = values[params.dataIndex]
                        if (originalValue === minValue) {
                            return theme.palette.primary.light
                        } else if (originalValue === maxValue) {
                            return theme.palette.primary.dark
                        } else {
                            const opacity = 0.7 // Opacity value (0 to 1)
                            const color = theme.palette.primary.main // Color value
                            return `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
                                color.slice(3, 5),
                                16,
                            )}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`
                        }
                    },
                },
            },
        ],
    } as EChartsOption
}
