import { Card, Typography } from '@mui/material'
import { WidgetProps } from './Widget'

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
        let title: string = ''
        let unit: string = ''
        switch (type) {
            case 'total_consumption':
                title = 'Consommation totale'
                unit = 'kWh'
                break
            case 'max_power':
                title = 'Puissance max'
                unit = 'kVa'
                break
            case 'internal _temperature':
                title = 'Température intérieure'
                unit = '°C'
                break
            case 'external_temperature':
                title = 'Température extérieure'
                unit = '°C'
                break
            default:
                break
        }

        if (element === 'unit') {
            return unit
        } else if (element === 'title') {
            return title
        }
    }

    return (
        <Card className="w-full rounded-20 shadow">
            <div className="p-20 pb-0">
                <Typography className="h3 font-medium">{renderWidgetAssets(type, 'title')}</Typography>
                <div className="flex flex-row flex-wrap items-center mt-12">
                    <Typography className="text-48 font-semibold leading-none tracking-tighter">22</Typography>
                    <div className="flex flex-col mx-8">
                        <Typography className="font-semibold" color="textSecondary">
                            {renderWidgetAssets(type, 'unit')}
                        </Typography>
                    </div>
                </div>
            </div>
        </Card>
    )
}
