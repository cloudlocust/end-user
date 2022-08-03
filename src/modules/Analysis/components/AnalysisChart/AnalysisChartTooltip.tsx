import { Theme } from '@mui/material/styles/createTheme'
import { capitalize, isNull } from 'lodash'
import React from 'react'
import dayjs from 'dayjs'

/**
 * Custom tooltip shown in AnalysisChart.
 *
 * @param param0 N/A.
 * @param param0.values Values.
 * @param param0.timestampValues Timestamps of the values.
 * @param param0.valueIndex Active value index.
 * @param param0.theme Theme applied.
 * @returns Custom tooltip.
 */
const AnalysisChartTooltp = ({
    values,
    valueIndex,
    timestampValues,
    theme,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    values: (number | null)[]
    // eslint-disable-next-line jsdoc/require-jsdoc
    timestampValues: number[]
    // eslint-disable-next-line jsdoc/require-jsdoc
    valueIndex: number
    // eslint-disable-next-line jsdoc/require-jsdoc
    theme: Theme
}) => {
    const textDateValue = capitalize(dayjs(new Date(timestampValues[valueIndex])).format('ddd DD'))
    const textValue = isNull(values[valueIndex]) ? '' : values[valueIndex]?.toFixed(2)

    return (
        <div
            style={{ background: theme.palette.primary.main, color: theme.palette.primary.contrastText }}
            className="text-8 p-8 flex justify-center items-center"
        >
            {`${textDateValue} - ${textValue} kWh`}
        </div>
    )
}

export default AnalysisChartTooltp
