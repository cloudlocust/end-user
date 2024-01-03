import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'
import { CardContent, useTheme, IconButton, useMediaQuery } from '@mui/material'
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
    const mdDown = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <FuseCard
            isLoading={isNrlinkPowerLoading}
            sx={{ height: mdDown ? CARD_HEIGHT : '40%', width: mdDown ? '30%' : '100%', minHeight: '100%' }}
            className="flex"
        >
            <CardContent
                className="flex flex-col h-full w-full"
                sx={{
                    padding: '1rem 1.5rem',
                    '&:last-child': {
                        paddingBottom: '1rem',
                    },
                }}
            >
                <div className="flex flex-col md:flex-row justify-between items-center h-full">
                    <IconButton
                        className="pointer-events-none mb-10 md:mb-0"
                        sx={{ bgcolor: theme.palette.primary.main }}
                    >
                        <DeviceThermostatIcon
                            style={{
                                color: theme.palette.primary.contrastText,
                                width: '25',
                                height: '25',
                            }}
                        />
                    </IconButton>
                    <div className="flex flex-col justify-evenly md:flex-row-reverse items-stretch flex-1">
                        <div className="flex flex-row justify-center">
                            <span className="text-44 leading-none font-medium text-grey-700">
                                {lastTemperatureData?.value ?? '-'}
                            </span>
                            <span className="text-14 leading-none self-start">°C</span>
                        </div>
                        <div className="flex items-center flex-1 justify-center md:justify-end md:mr-5">
                            <span className="text-13 text-center text-grey-500">{currentHousing?.address.city}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </FuseCard>
    )
}
