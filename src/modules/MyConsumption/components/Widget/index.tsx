import { Typography, Grid, Card, CircularProgress, useTheme } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'

/**
 * Single Widget component.
 *
 * @param root0 N/A.
 * @param root0.isMetricsLoading Loading metric state.
 * @param root0.title Widget title.
 * @param root0.unit Widget unit.
 * @param root0.value Widget value.
 * @param root0.infoIcon Widget infoIcon.
 * @returns Single Widget component.
 */
export const Widget = ({ isMetricsLoading, title, unit, infoIcon, value }: IWidgetProps) => {
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
                            <div className="flex justify-between">
                                {/* Widget title */}
                                <TypographyFormatMessage className="sm:text-16 font-medium md:text-17">
                                    {title}
                                </TypographyFormatMessage>
                                {/* Widget infoIcon */}
                                {infoIcon}
                            </div>
                            {/* If onError returns true, it will display an error message for the widget type */}
                            {!value ? (
                                <div className="mb-44 text-center">
                                    <TypographyFormatMessage>Aucune donnée disponnible</TypographyFormatMessage>
                                </div>
                            ) : (
                                <div className="flex flex-row flex-wrap mt-12 items-end">
                                    {/* Widget value */}
                                    <Typography className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tighter items-end mr-auto">
                                        {value}
                                    </Typography>
                                    <div className="flex flex-col">
                                        {/* Widget unit */}
                                        <Typography className="text-14 font-medium mb-24" color="textSecondary">
                                            {unit}
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
