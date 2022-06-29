import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
/**
 * Data Consumption Period.
 */
export const dataConsumptionPeriod = [
    {
        name: 'Jour',
        interval: '2min',
        period: 'daily' as periodType,
    },
    {
        name: 'Semaine',
        interval: '1d',
        period: 'weekly' as periodType,
    },
    {
        name: 'Mois',
        interval: '1d',
        period: 'monthly' as periodType,
    },

    {
        name: 'Année',
        interval: '1 month',
        period: 'yearly' as periodType,
    },
]
/**
 * Mobile Date Picker Period Props.
 */
export const mobileDatePickerPeriodProps = [
    {
        period: 'daily',
        views: ['day'],
        width: '80px',
        inputFormat: 'dd/MM/yyyy',
    },
    {
        period: 'weekly',
        views: ['day'],
        width: '80px',
        inputFormat: 'dd/MM/yyyy',
    },
    {
        period: 'monthly',
        views: ['month', 'year'],
        width: '55px',
        inputFormat: 'MM/yyyy',
    },
    {
        period: 'yearly',
        views: ['year'],
        width: '40px',
        inputFormat: 'yyyy',
    },
]
