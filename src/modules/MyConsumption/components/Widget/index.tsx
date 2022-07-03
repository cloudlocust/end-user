import { Typography, Grid, Card } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'

/**
 * Single Widget component.
 *
 * @param root0 N/A.
 * @param root0.title Widget title.
 * @param root0.unit Widget unit.
 * @returns Single Widget component.
 */
export const Widget = ({ title, unit }: IWidgetProps) => {
    return (
        <Grid item xs={6} sm={6} md={4} lg={3} xl={3}>
            <Card className="w-full rounded-20 shadow sm:m-4 " variant="outlined">
                <div className="p-16 flex flex-col justify-between">
                    {/* Widget title */}
                    <TypographyFormatMessage
                        className="sm:text-17 md:text-18 font-normal"
                        style={{ minHeight: '65px' }}
                    >
                        {title}
                    </TypographyFormatMessage>
                    <div className="flex flex-row flex-wrap mt-12 items-end">
                        {/* Widget value */}
                        <Typography className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tighter items-end mr-auto">
                            {/* {value} */}
                        </Typography>
                        <div className="flex flex-col">
                            {/* Widget unit */}
                            <Typography className="text-18 font-medium mb-24" color="textSecondary">
                                {unit}
                            </Typography>
                            {/* TODDO MYEM-2588*/}
                            {/* Widget arrow */}
                        </div>
                    </div>
                </div>
            </Card>
        </Grid>
    )
}
