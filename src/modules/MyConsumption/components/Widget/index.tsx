import { Typography, Grid, Card, CircularProgress, useTheme } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import { IWidgetProps, widgetTitleType } from 'src/modules/MyConsumption/components/Widget/Widget'

/**
 * Function that returns title according to metric target.
 *
 * @param target Metric Target.
 * @returns Widget title.
 */
const renderWidgetTitle = (target: metricTargetType): widgetTitleType => {
    switch (target) {
        case metricTargetsEnum.consumption:
            return 'Consommation Totale'
        case metricTargetsEnum.pMax:
            return 'Puissance Maximale'
        case metricTargetsEnum.externalTemperature:
            return 'Température Extérieure'
        case metricTargetsEnum.internalTemperature:
            return 'Température Intérieure'
        default:
            throw Error('Wrong target')
    }
}

/**
 * Single Widget component.
 *
 * @param root0 N/A.
 * @param root0.type Widget type.
 * @param root0.isMetricsLoading Loading metric state.
 * @param root0.computeAssets Return of computeAssets function.
 * @returns Single Widget component.
 */
// TODO Improve value and unit in order not to have them from 2 functions but rather one.
// To be done when the architecture of metrics in Widgets is changed.
export const Widget = ({ isMetricsLoading, type, computeAssets }: IWidgetProps) => {
    const theme = useTheme()

    return (
        <Grid item xs={6} sm={6} md={4} lg={3} xl={3} className="flex">
            <Card className="w-full rounded-20 shadow sm:m-4" variant="outlined" style={{ minHeight: '170px' }}>
                {isMetricsLoading ? (
                    <div
                        className="flex flex-col justify-center items-center w-full h-full"
                        style={{ height: '170px' }}
                    >
                        <CircularProgress style={{ color: theme.palette.primary.main }} />
                    </div>
                ) : (
                    <>
                        <div className="p-16 flex flex-col justify-between h-full">
                            {/* Widget title */}
                            <TypographyFormatMessage className="sm:text-16 font-medium md:text-17">
                                {renderWidgetTitle(type)}
                            </TypographyFormatMessage>
                            {/* If onError returns true, it will display an error message for the widget type */}
                            {!computeAssets.value ? (
                                <div className="mb-44 text-center">
                                    <TypographyFormatMessage>Aucune donnée disponnible</TypographyFormatMessage>
                                </div>
                            ) : (
                                <div className="flex flex-row flex-wrap mt-12 items-end">
                                    {/* Widget value */}
                                    <Typography className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tighter items-end mr-auto">
                                        {computeAssets.value}
                                    </Typography>
                                    <div className="flex flex-col">
                                        {/* Widget unit */}
                                        <Typography className="text-14 font-medium mb-24" color="textSecondary">
                                            {computeAssets.unit}
                                        </Typography>
                                        {/* TODDO MYEM-2588*/}
                                        {/* Widget arrow */}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Card>
        </Grid>
    )
}
