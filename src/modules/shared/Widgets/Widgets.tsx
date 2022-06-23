import { Card, Typography, CircularProgress } from '@mui/material'
import { IWidgetAssets, IWidgetProps } from 'src/modules/shared/Widgets/Widget'
import { useTheme } from '@mui/material'

const WIDGET_MAX_WIDTH = '170px'
const WIDGET_MAX_HEIGHT = '180px'

/**
 * Reusable widget component.
 *
 * @param root0 N/A.
 * @param root0.type Widget type.
 * @param root0.data Widget data.
 * @param root0.isMetricsLoading Widget loading indicator.
 * @returns Widget component.
 */
export const Widget = ({ type, data, isMetricsLoading }: IWidgetProps) => {
    const theme = useTheme()

    /**
     * Function that returns widget title and unit according to type.
     *
     * @param type Widget type.
     * @param element Widget elements like title, unit.
     * @returns Title according to the widget type.
     */
    const renderWidgetAssets = (type: IWidgetProps['type'], element: 'title' | 'unit') => {
        let widgetTitle = ''
        let widgetUnit = ''

        // Render widget information according to the type from props.
        switch (type) {
            case 'total_consumption':
                widgetTitle = 'Consommation totale' as IWidgetAssets['title']
                widgetUnit = 'kWh' as IWidgetAssets['unit']
                break
            case 'max_power':
                widgetTitle = 'Puissance max' as IWidgetAssets['title']
                widgetUnit = 'kVa' as IWidgetAssets['unit']
                break
            case 'internal_temperature':
                widgetTitle = 'Température intérieure' as IWidgetAssets['title']
                widgetUnit = '°C' as IWidgetAssets['unit']
                break
            case 'external_temperature':
                widgetTitle = 'Température extérieure' as IWidgetAssets['title']
                widgetUnit = '°C' as IWidgetAssets['unit']
                break
            default:
                break
        }

        // Render asset according to the element.
        switch (element) {
            case 'title':
                return widgetTitle
            case 'unit':
                return widgetUnit
            default:
                break
        }
    }

    if (data.length === 0) return null

    return (
        <Card
            className="w-full rounded-20 shadow my-8 mx-6 sm:m-4"
            style={{ maxWidth: WIDGET_MAX_WIDTH, maxHeight: WIDGET_MAX_HEIGHT }}
        >
            {isMetricsLoading && (
                <div className="flex flex-col justify-center items-center w-full h-full">
                    <CircularProgress style={{ color: theme.palette.primary.main }} />
                </div>
            )}
            <div className="p-16">
                <Typography className="h4 font-medium" style={{ minHeight: '65px' }}>
                    {renderWidgetAssets(type, 'title')}
                </Typography>
                <div className="flex flex-row flex-wrap mt-12">
                    {/* Widget value */}
                    <Typography className="text-6xl font-normal leading-none tracking-tighter items-center mx-auto">
                        22
                    </Typography>
                    <div className="flex flex-col mx-8 ml-auto">
                        {/* Widget unit */}
                        <Typography className="font-medium text-base mb-8" color="textSecondary">
                            {renderWidgetAssets(type, 'unit')}
                        </Typography>
                        {/* Widget arrow */}
                    </div>
                </div>
            </div>
        </Card>
    )
}
