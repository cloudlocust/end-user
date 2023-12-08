import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'
import { CardContent, useTheme, IconButton } from '@mui/material'
import { CARD_HEIGHT } from 'src/modules/Dashboard/StatusWrapper/components/EnergyStatusWidget/Index'
import { WeatherWidgetProps } from 'src/modules/Dashboard/StatusWrapper/components/WeatherWidget/weatherWidget.d'
import { DeviceThermostat } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'

/**
 * WeatherWidget component.
 *
 * @param props N/A.
 * @returns WeatherWidget Jsx.
 */
export const WeatherWidget = (props: WeatherWidgetProps) => {
    const { lastTemperatureData, isNrlinkPowerLoading } = props
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const theme = useTheme()

    return (
        <FuseCard isLoading={isNrlinkPowerLoading} sx={{ height: CARD_HEIGHT, width: '30%' }} className="flex">
            <CardContent
                className="flex flex-col h-full w-full"
                sx={{
                    padding: '1rem',
                    '&:last-child': {
                        paddingBottom: '1rem',
                    },
                }}
            >
                <div className="flex justify-around items-center flex-col h-full">
                    <IconButton sx={{ bgcolor: theme.palette.primary.main, pointerEvents: 'none' }}>
                        <DeviceThermostat
                            sx={{
                                width: 25,
                                height: 25,
                                color: theme.palette.primary.contrastText,
                            }}
                        />
                    </IconButton>
                    <div className="flex flex-col justify-around items-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-3xl font-semibold">{lastTemperatureData?.value ?? '-'}</span>
                            <span className="text-sm mb-auto">°C</span>
                        </div>
                        <span className="text-13">{currentHousing?.address.city}</span>
                    </div>
                </div>
            </CardContent>
        </FuseCard>
    )
}
