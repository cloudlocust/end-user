import { CardContent, IconButton, useTheme, useMediaQuery } from '@mui/material'
import { FuseCard } from 'src/modules/shared/FuseCard'
import { ReactComponent as AdviceIcon } from 'src/assets/images/navbarItems/advice.svg'
import { iconStyle } from 'src/modules/Dashboard/StatusWrapper/components/EnergyStatusWidget/Index'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import useEcogestes from 'src/modules/Ecogestes/hooks/ecogestesHook'
import { useModal } from 'src/hooks/useModal'
import { DetailAdviceDialog } from 'src/modules/Dashboard/AdviceContainer/components/DetailAdviceDialog'
import { IEcogeste } from 'src/modules/Ecogestes/components/ecogeste'
import { useState } from 'react'
import { NewEcogesteCard } from 'src/modules/Ecogestes/components/NewEcogesteCard'
import { orderListBy } from 'src/modules/utils'

/**
 * @see https://stackoverflow.com/a/60403040/14005627
 */
export const CardContentPaddingStyle = {
    padding: '1rem',
    '&:last-child': {
        paddingBottom: '1rem',
    },
}

/**
 * Advice wrapper component.

 * @returns Advice wrapper component.
 */
export const AdviceContainer = () => {
    const { elementList: ecogestes, loadingInProgress } = useEcogestes({ highlighted: true })
    const theme = useTheme()
    const smDown = useMediaQuery(theme.breakpoints.down('sm'))
    const {
        isOpen: isDetailsAdviceDialogOpen,
        closeModal: onCloseDetailAdvicePopup,
        openModal: onOpenDetailAdvicePopup,
    } = useModal()
    const [currentEcogeste, setCurrentEcogeste] = useState<IEcogeste | null>(null)

    const cards = orderListBy(ecogestes ?? [], (item) => item.createdAt ?? '', true).map((ecogeste) => (
        <NewEcogesteCard
            ecogeste={ecogeste}
            showMoreDetails={() => {
                setCurrentEcogeste(ecogeste)
                onOpenDetailAdvicePopup()
            }}
        />
    ))

    return (
        <FuseCard
            className="col-span-12"
            isLoading={loadingInProgress}
            style={{ height: smDown && loadingInProgress ? '150px' : !smDown && loadingInProgress ? '300px' : 'auto' }}
        >
            <CardContent
                className="flex flex-col h-full items-stretch"
                /**
                 * @see https://stackoverflow.com/a/60403040/14005627
                 */
                sx={{ ...CardContentPaddingStyle }}
            >
                <div className="flex justify-between mb-10">
                    <div className="flex items-center space-x-10">
                        <IconButton sx={{ bgcolor: theme.palette.primary.main }} className="pointer-events-none">
                            <AdviceIcon fill={theme.palette.primary.contrastText} {...iconStyle} />
                        </IconButton>
                        <TypographyFormatMessage className="text-14 md:text-18 leading-none">
                            Conseils du moment
                        </TypographyFormatMessage>
                    </div>
                    <Link to="/advices" className="flex items-center mr-10">
                        <TypographyFormatMessage className="text-12 md:text-14 leading-none underline text-grey-700">
                            Voir tous &gt;
                        </TypographyFormatMessage>
                    </Link>
                </div>
                <CardContent sx={{ ...CardContentPaddingStyle }} className="w-full h-full">
                    {smDown ? (
                        <Swiper spaceBetween={10} slidesPerView={1.1}>
                            {cards?.map((card, index) => (
                                <SwiperSlide data-testid="ecogeste-swiper-slide-card" key={index}>
                                    {card}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div
                            className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 no-scrollbar h-full"
                            style={{ minHeight: '250px' }}
                        >
                            {cards}
                        </div>
                    )}
                </CardContent>
            </CardContent>
            {isDetailsAdviceDialogOpen && (
                <DetailAdviceDialog
                    isDetailAdvicePopupOpen={isDetailsAdviceDialogOpen}
                    onCloseDetailAdvicePopup={onCloseDetailAdvicePopup}
                    currentEcogeste={currentEcogeste}
                    isDashboardAdvice
                />
            )}
        </FuseCard>
    )
}
