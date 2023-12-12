import Icon from '@mui/material/Icon'
import { useTheme } from '@mui/material'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { TendanceVeilleProps } from 'src/modules/Dashboard/DashboardConsumptionWidget/TendanceVeille/TendanceVeille'
import { getWidgetIndicatorColor } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * Component to show the percentage of change for the consumption (to use in the DashboardConsumptionWidget Component).
 *
 * @param root0 N/A.
 * @param root0.percentageChange The percentage of change.
 * @returns TendanceVeille Component.
 */
export const TendanceVeille = ({ percentageChange }: TendanceVeilleProps) => {
    const theme = useTheme()
    const color = getWidgetIndicatorColor(metricTargetsEnum.consumption, percentageChange)
    const themeMainHexColor = theme.palette[color].main

    return (
        <div
            className="flex items-center gap-10 px-14 py-5 rounded-full relative"
            style={{ backgroundColor: `${themeMainHexColor}25` }}
            data-testid="percentage-change"
        >
            <Icon color={color} sx={{ fontSize: { xs: '24px', md: '32px' } }}>
                {percentageChange < 0 ? 'trending_down' : 'trending_up'}
            </Icon>
            <label className="text-14 font-500" style={{ color: themeMainHexColor }}>
                {Math.round(Math.abs(percentageChange))}&nbsp;%
            </label>
            <TypographyFormatMessage className="text-14 text-grey-500 absolute right-0 -bottom-28 whitespace-nowrap">
                Comparé à hier
            </TypographyFormatMessage>
        </div>
    )
}
