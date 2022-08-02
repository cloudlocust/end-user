import { createTheme } from '@mui/material/styles'
import { waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import AnalysisChartTooltip from 'src/modules/Analysis/components/AnalysisChart/AnalysisChartTooltip'

describe('test pure function', () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#FFEECD',
            },
        },
    })
    test('AnalysisChartTooltip custom tooltip test with different cases', async () => {
        // Saturday 1 Jan 2022, Sunday 2 Jan 2022
        const timestampValues = [1640995200000, 1641081600000]

        const values = [
            // Null value.
            null,
            // Valid value.
            10.55,
        ]

        const unit = 'kWh'
        // Test cases
        const results = [
            // Null value tooltip text
            `Sat 01 -  ${unit}`,
            // Valid value tooltip text
            `Sun 02 - 10.55 ${unit}`,
        ]
        results.forEach(async (result, index) => {
            const { getByText } = reduxedRender(
                <AnalysisChartTooltip
                    valueIndex={index}
                    values={values}
                    timestampValues={timestampValues}
                    theme={theme}
                />,
            )
            await waitFor(() => {
                expect(getByText(result)).toBeTruthy()
            })
        })
    })
})
