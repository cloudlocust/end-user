import { Card, Typography } from '@mui/material'
import { WidgetProps } from './Widget'

const WIDGET_MAX_WIDTH = '170px'
const WIDGET_MAX_HEIGHT = '180px'

/**
 * Reusable widget component.
 *
 * @param root0 N/A.
 * @param root0.type Widget type.
 * @returns Widget component.
 */
export const Widget = ({ type }: WidgetProps) => {
    /**
     * Function that returns widget title and unit according to type.
     *
     * @param type Widget type.
     * @param element Widget elements like title, unit.
     * @returns Title according to the widget type.
     */
    const renderWidgetAssets = (type: WidgetProps['type'], element: 'title' | 'unit') => {
        let widgetTitle: string = ''
        let widgetUnit: string = ''
        switch (type) {
            case 'total_consumption':
                widgetTitle = 'Consommation totale'
                widgetUnit = 'kWh'
                break
            case 'max_power':
                widgetTitle = 'Puissance max'
                widgetUnit = 'kVa'
                break
            case 'internal _temperature':
                widgetTitle = 'Température intérieure'
                widgetUnit = '°C'
                break
            case 'external_temperature':
                widgetTitle = 'Température extérieure'
                widgetUnit = '°C'
                break
            default:
                break
        }

        if (element === 'unit') {
            return widgetUnit
        } else if (element === 'title') {
            return widgetTitle
        }
    }

    return (
        <Card
            className="w-full rounded-20 shadow my-8 mx-6 sm:m-4"
            style={{ maxWidth: WIDGET_MAX_WIDTH, maxHeight: WIDGET_MAX_HEIGHT }}
        >
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
                        {/* Widget sign */}
                        {/* <Typography className="font-semibold text-base" color="textSecondary">
                            {renderWidgetAssets(type, 'unit')}
                        </Typography> */}
                    </div>
                </div>
            </div>
        </Card>
    )
}
