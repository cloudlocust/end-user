import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'
import { CardContent, useTheme, IconButton } from '@mui/material'
import { CARD_HEIGHT } from 'src/modules/Dashboard/StatusWrapper/components/EnergyStatusWidget/Index'
import { WeatherWidgetProps } from 'src/modules/Dashboard/StatusWrapper/components/WeatherWidget/weatherWidget.d'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { DeviceThermostat as DeviceThermostatIcon } from '@mui/icons-material'

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
                    padding: '1rem 1.5rem',
                    '&:last-child': {
                        paddingBottom: '1rem',
                    },
                }}
            >
                <div className="flex justify-between items-center flex-col h-full">
                    <IconButton className="pointer-events-none mb-10" sx={{ bgcolor: theme.palette.primary.main }}>
                        <DeviceThermostatIcon
                            style={{
                                color: theme.palette.primary.contrastText,
                                width: '25',
                                height: '25',
                            }}
                        />
                    </IconButton>
                    <div className="flex flex-col justify-center items-center flex-1">
                        <div className="">
                            <span className="text-44 leading-3 font-medium text-grey-700 mb-10">
                                {lastTemperatureData?.value ?? '-'}
                            </span>
                            <span className="text-14 leading-3 mb-auto">°C</span>
                        </div>
                        <span className="text-13 text-center text-grey-700">{currentHousing?.address.city}</span>
                    </div>
                </div>
            </CardContent>
        </FuseCard>
    )
}
