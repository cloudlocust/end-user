import { createTheme } from '@mui/material/styles'
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
            `${unit}`,
            // Valid value tooltip text
            `10.55 ${unit}`,
        ]
        results.forEach((result, index) => {
            const { getByText } = reduxedRender(
                <AnalysisChartTooltip valueIndex={index} values={values} theme={theme} />,
            )
            expect(getByText(result)).toBeTruthy()
        })
    })
})
