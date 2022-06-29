import { Grid, useTheme } from '@mui/material'
import { Widget } from 'src/modules/MyConsumption/components/Widgets'
import { widgetListType } from 'src/modules/MyConsumption/components/Widgets/Widget'

const widgetsList: widgetListType = [
    {
        type: 'consumption_metrics',
        title: 'Consommation Totale',
        unit: 'kWh',
    },
    {
        type: 'enedis_max_power',
        title: 'Puissance Maximale',
        unit: 'kVh',
    },
    {
        type: 'external_temperature_metrics',
        title: 'Température Intérieure',
        unit: '°C',
    },
    {
        type: 'nrlink_internal_temperature_metrics',
        title: 'Température Extérieure',
        unit: '°C',
    },
]

/**
 * Widget List component that contains every widget.
 *
 * @returns WidgetsList component.
 */
export const WidgetList = () => {
    const theme = useTheme()

    return (
        <div style={{ background: theme.palette.grey[100] }} className="w-full my-8">
            <Grid container spacing={{ xs: 1, md: 2 }}>
                {widgetsList.map((widget) => {
                    return <Widget key={widget.title} title={widget.title} unit={widget.unit} />
                })}
            </Grid>
        </div>
    )
}
