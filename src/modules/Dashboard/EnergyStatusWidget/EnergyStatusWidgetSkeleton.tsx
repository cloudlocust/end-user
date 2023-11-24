import { Skeleton, CardContent, useTheme } from '@mui/material'
import { CARD_HEIGHT } from 'src/modules/Dashboard/EnergyStatusWidget/Index'
import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'

export const EnergyStatusWidgetSkeleton = () => {
    const theme = useTheme()
    const themeContrastText = theme.palette.primary.contrastText

    return (
        <FuseCard sx={{ bgcolor: theme.palette.primary.main, height: CARD_HEIGHT }}>
            <CardContent className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-5">
                    <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: themeContrastText }} />
                    <Skeleton width="60%" height={24} sx={{ bgcolor: themeContrastText }} />
                </div>
                <div className="flex flex-col w-full flex-grow">
                    <div className="flex justify-end items-center text-14 mb-5">
                        <Skeleton width="80%" height={20} sx={{ bgcolor: themeContrastText }} />
                    </div>
                    <div className="flex flex-row ml-auto flex-grow">
                        <Skeleton width="20%" height={35} sx={{ bgcolor: themeContrastText, marginRight: '20px' }} />
                        <Skeleton width="20%" height={35} sx={{ bgcolor: themeContrastText }} />
                    </div>
                </div>
            </CardContent>
        </FuseCard>
    )
}
