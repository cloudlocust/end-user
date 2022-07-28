import { Theme } from '@mui/material/styles/createTheme'
import { isNull } from 'lodash'
import React from 'react'

/**
 * Custom tooltip shown in AnalysisChart.
 *
 * @param param0 N/A.
 * @param param0.values Values.
 * @param param0.valueIndex Active value index.
 * @param param0.theme Theme applied.
 * @returns Custom tooltip.
 */
const AnalysisChartTooltp = ({
    values,
    valueIndex,
    theme,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    values: (number | null)[]
    // eslint-disable-next-line jsdoc/require-jsdoc
    valueIndex: number
    // eslint-disable-next-line jsdoc/require-jsdoc
    theme: Theme
}) => {
    return (
        <div
            style={{ background: theme.palette.primary.main, color: theme.palette.primary.contrastText }}
            className="text-8 p-8 flex justify-center items-center"
        >
            {`${isNull(values[valueIndex]) ? '' : values[valueIndex]?.toFixed(2)} kWh`}
        </div>
    )
}

export default AnalysisChartTooltp
