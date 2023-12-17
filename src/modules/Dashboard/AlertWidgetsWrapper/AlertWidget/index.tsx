import { useMemo } from 'react'
import { useTheme } from '@mui/material'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import GaugeChart from 'react-gauge-chart'
import {
    calculateGaugeChartPercent,
    getAlertPeriodErrorText,
    getAlertPeriodTitleText,
    // getFormatedAlertThreshold,
} from 'src/modules/Dashboard/AlertWidgetsWrapper/AlertWidget/utils'
import { AlertWidgetProps } from 'src/modules/Dashboard/AlertWidgetsWrapper/AlertWidget/AlertWidget'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * AlertWidget component.
 *
 * @param root0 N/A.
 * @param root0.alertPeriod The alert period.
 * @param root0.alertThreshold The alert threshold (seuil) value for consumption (in Wh) or price (in €).
 * @param root0.currentValue The current value of the consumption (in Wh) or price (in €).
 * @returns AlertWidget Jsx.
 */
export const AlertWidget = ({ alertPeriod, alertThreshold, currentValue }: AlertWidgetProps) => {
    const theme = useTheme()
    const { formatMessage } = useIntl()

    const gaugeChartPercent = useMemo(
        () => (alertThreshold !== undefined ? calculateGaugeChartPercent(alertThreshold, currentValue) : 0),
        [alertThreshold, currentValue],
    )

    const [alertPeriodTitleText, alertPeriodErrorText] = useMemo(() => {
        const titleText = getAlertPeriodTitleText(alertPeriod)
        const errorText = getAlertPeriodErrorText(alertPeriod)
        return [
            formatMessage({ id: titleText, defaultMessage: titleText }),
            formatMessage({ id: errorText, defaultMessage: errorText }),
        ]
    }, [alertPeriod, formatMessage])

    // const formatedAlertThreshold = useMemo(
    //     () => (alertThreshold !== undefined ? getFormatedAlertThreshold(alertThreshold, alertType) : ''),
    //     [alertThreshold, alertType],
    // )

    return (
        <div className="flex flex-col min-h-288 p-20">
            <div className="flex items-center gap-10">
                <IconButton className="pointer-events-none" size="small" sx={{ bgcolor: theme.palette.primary.main }}>
                    <NotificationsActiveIcon sx={{ color: theme.palette.primary.contrastText }} />
                </IconButton>
                <div>
                    <TypographyFormatMessage className="inline text-16">Mon seuil d'alerte</TypographyFormatMessage>{' '}
                    <span className="text-16 font-700">{alertPeriodTitleText}</span>
                </div>
            </div>
            {alertThreshold !== undefined ? (
                <Box
                    className="flex-1 relative flex items-center justify-center mt-14"
                    sx={{
                        '& .gauge-chart-alert': {
                            maxWidth: '400px',
                        },
                        '& .gauge-chart-alert > *': {
                            transform: 'scale(1.2) translate(0, 4%)',
                        },
                    }}
                    data-testid={`gauge-chart-alert-${alertPeriod}`}
                >
                    {/* <span className="absolute right-5 top-0 underline font-700 text-14">{formatedAlertThreshold}</span> */}
                    <GaugeChart
                        id={`gauge-chart-alert-${alertPeriod}`}
                        nrOfLevels={6}
                        colors={[`${theme.palette.primary.main}22`, `${theme.palette.primary.main}ff`]}
                        arcWidth={0.3}
                        percent={gaugeChartPercent}
                        hideText
                        className="gauge-chart-alert"
                    />
                </Box>
            ) : (
                <div className="flex-1 flex flex-col text-center mt-14 mx-20">
                    <div className="flex-1 flex flex-col justify-center gap-10">
                        <div>
                            <TypographyFormatMessage className="inline text-14">
                                Vous n'avez pas encore configuré d'alerte de consommation
                            </TypographyFormatMessage>{' '}
                            <span className="text-14">{alertPeriodErrorText}.</span>
                        </div>
                        <TypographyFormatMessage className="text-14">
                            Les alertes peuvent contribuer à réduire votre consommation et vos factures d'énergie.
                        </TypographyFormatMessage>
                    </div>
                    <Link to="/alerts" className="mb-10">
                        <Button variant="contained">
                            {formatMessage({ id: 'Créer une alerte', defaultMessage: 'Créer une alerte' })}
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
