import React, { useCallback, useEffect, useRef, SyntheticEvent } from 'react'
import { PostPlaceholder } from 'src/common/ui-kit/components/MapElementList/components/ContentLoader/ContentLoader'
// import MapElementList from 'src/common/ui-kit/components/MapElementList'
import { useHousingList } from 'src/modules/MyHouse/components/HousingList/HousingListHook'
import HousingCard from 'src/modules/MyHouse/components/HousingList/components/HousingCard'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { useTheme } from '@mui/material/styles'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { styled } from '@mui/material/styles'
import { isEmpty } from 'lodash'
import EmptyTableMessage from 'src/common/ui-kit/components/Table/EmptyTableMessage'
import { useIntl } from 'src/common/react-platform-translation'
import ElementListGrid from 'src/common/ui-kit/components/MapElementList/components/ElementListGrid/ElementListGrid'
import { ButtonLoader } from 'src/common/ui-kit'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

const Root = styled(PageSimple)(({ theme }) => ({
    '& .PageSimple-header': {
        minHeight: 72,
        height: 72,
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            minHeight: 136,
            height: 136,
        },
    },
    '& .PageSimple-content': {
        display: 'flex',
        position: 'relative',
    },
    '& .PageSimple-contentCard': {
        overflow: 'hidden',
    },
    [theme.breakpoints.down('md')]: {
        '& .PageSimple-toolbar': {
            height: 'auto',
        },
    },
}))

/**
 * HousingList view component containing Map & Housing Items.
 *
 * @returns HousingList page component.
 */
const HousingList = () => {
    const listingWrapperRef = useRef<HTMLDivElement>(null)
    const scrollTopButtonRef = useRef<HTMLButtonElement>(null)
    const mapEl = useRef<HTMLDivElement>(null)
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const mdDown = useMediaQuery(theme.breakpoints.down('md'))
    const lgDown = useMediaQuery(theme.breakpoints.down('lg'))
    const {
        elementList: housingList,
        loadingInProgress: isHousingInProgress,
        loadMoreElements: loadMoreHousings,
        noMoreElementToLoad: noMoreHousingToLoad,
    } = useHousingList(10)

    /**
     * Handler for the onScrollY Event. This function handles the style.top property of the map component, because it has a fixed property,
     * So putting top: 0 is not enough, We want to place the map where the ListingWrapper div begins,
     * So we have to count that top property when we scroll, so that it feels like it never moved from its original positiion.
     */
    const handleScroll = useCallback(() => {
        if (listingWrapperRef.current) {
            const listingWrapperRefOffsetY = Math.round(listingWrapperRef.current!.getBoundingClientRect().y)
            // When this condition is true, it means it didn't scroll enough to get to the start position of map, and thus the searchbar still visible.
            if (listingWrapperRefOffsetY > 0) {
                // !mdDown means it's not mobile, because in mobile we don't have scroll issues so no need to handle the top position of the map.
                if (mapEl.current && !mdDown)
                    mapEl.current.style.top = `${listingWrapperRef.current!.getBoundingClientRect().y}px`
                scrollTopButtonRef.current!.style.display = 'none'
                // Else means it scrolled enough passed the start position of map, and thus the searchbar is not visible anymore, and thus we help the user with a button to scroll top.
            } else {
                if (mapEl.current && !mdDown) mapEl.current.style.top = '0'
                scrollTopButtonRef.current!.style.display = 'block'
            }
        }
    }, [mapEl, mdDown])

    useEffect(() => {
        // We add a scroll event because map div is fixed position, and thus the scroll event helps to make the map feel that it didn't move from its starting position.
        document.getElementById('root')!.addEventListener('scroll', handleScroll)
    }, [handleScroll])

    // TODO - Refacto this component.
    return (
        <Root
            header={
                <div className="w-full relative flex flex-col justify-center items-center p-16">
                    <TypographyFormatMessage
                        className="text-18 md:text-24"
                        style={{ color: theme.palette.primary.contrastText }}
                    >
                        Logement
                    </TypographyFormatMessage>
                </div>
            }
            content={
                <div className="w-full mt-10" ref={listingWrapperRef}>
                    {isEmpty(housingList) && !isHousingInProgress ? (
                        <EmptyTableMessage
                            message={formatMessage({
                                id: 'La liste est vide',
                                defaultMessage: 'La liste est vide',
                            })}
                        />
                    ) : (
                        <>
                            <div className="w-full">
                                <ElementListGrid<IHousing>
                                    data={housingList}
                                    shrink={false}
                                    loadingData={isHousingInProgress}
                                    ElementCard={HousingCard}
                                    placeholder={<PostPlaceholder />}
                                />

                                <IconButton
                                    onClick={(e: SyntheticEvent) => {
                                        document.getElementById('root')!.scrollTo({
                                            top: 0,
                                            behavior: 'smooth',
                                        })
                                    }}
                                    className={`bottom-5 left-300 fixed ${lgDown && 'mb-56'}`}
                                    style={{ display: 'none' }}
                                    ref={scrollTopButtonRef}
                                >
                                    <Icon color="action">arrow_upward</Icon>
                                </IconButton>
                                {noMoreHousingToLoad ? (
                                    <></>
                                ) : (
                                    <div className="flex justify-center m-12">
                                        <ButtonLoader
                                            inProgress={isHousingInProgress}
                                            type="button"
                                            onClick={(e: SyntheticEvent) => loadMoreHousings()}
                                        >
                                            {formatMessage({ id: 'Afficher plus', defaultMessage: 'Afficher plus' })}
                                        </ButtonLoader>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            }
        />
    )
}

export default HousingList
