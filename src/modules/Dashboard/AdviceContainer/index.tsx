import { CardContent, IconButton, useTheme, alpha, useMediaQuery } from '@mui/material'
import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'
import { ReactComponent as AdviceIcon } from 'src/assets/images/navbarItems/advice.svg'
import { iconStyle } from 'src/modules/Dashboard/StatusWrapper/components/EnergyStatusWidget/Index'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Link } from 'react-router-dom'
import { truncate } from 'lodash'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import { SavingPercentage } from 'src/modules/Dashboard/AdviceContainer/components/SavingPercentage'
import useEcogestes from 'src/modules/Ecogestes/hooks/ecogestesHook'
import { useModal } from 'src/hooks/useModal'
import { DetailAdviceDialog } from 'src/modules/Dashboard/AdviceContainer/components/DetailAdviceDialog'
import { IEcogeste } from 'src/modules/Ecogestes/components/ecogeste'
import { useState } from 'react'

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
    const { elementList: ecogestesList, loadingInProgress } = useEcogestes({ highlighted: true })
    const theme = useTheme()
    const smDown = useMediaQuery(theme.breakpoints.down('sm'))
    const {
        isOpen: isDetailsAdviceDialogOpen,
        closeModal: onCloseDetailAdvicePopup,
        openModal: onOpenDetailAdvicePopup,
    } = useModal()
    const [currentEcogeste, setCurrentEcogeste] = useState<IEcogeste | null>(null)

    const cards = ecogestesList?.map((ecogeste) => (
        <FuseCard
            className="flex flex-col p-20"
            key={ecogeste.id}
            sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }}
        >
            <div className="flex items-center mb-10 w-full flex-1">
                <div style={{ width: 25, height: 25 }} className="mr-10">
                    <img
                        style={{
                            width: '100%',
                            height: '100%',
                            filter: `opacity(0.1) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main})`,
                        }}
                        src={ecogeste.urlIcon}
                        alt={ecogeste.title}
                    />
                </div>
                <div className="flex justify-between items-center w-full">
                    <TypographyFormatMessage className="text-14 md:text-16 leading-none" fontWeight={600}>
                        {ecogeste.title}
                    </TypographyFormatMessage>
                    <SavingPercentage percentageSaved={ecogeste.percentageSaved} />
                </div>
            </div>
            <div className="flex flex-auto mb-10">
                <TypographyFormatMessage className="text-14 md:text-16 text-justify">
                    {truncate(ecogeste.description, { length: 150 })}
                </TypographyFormatMessage>
            </div>
            <div
                className="flex justify-end items-end flex-auto cursor-pointer"
                onClick={() => {
                    setCurrentEcogeste(ecogeste)
                    onOpenDetailAdvicePopup()
                }}
            >
                <TypographyFormatMessage className="text-12 md:text-14 leading-none underline text-grey-700">
                    Consulter &gt;
                </TypographyFormatMessage>
            </div>
        </FuseCard>
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
                />
            )}
        </FuseCard>
    )
}
