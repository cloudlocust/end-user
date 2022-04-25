import React, { useState, useCallback, useEffect, useRef, SyntheticEvent } from 'react'
import { PostPlaceholder } from 'src/common/ui-kit/components/MapElementList/components/ContentLoader/ContentLoader'
import 'src/common/ui-kit/components/MapElementList/components/Toolbar/Toolbar'
import Map from 'src/common/ui-kit/components/MapElementList/components/Map/Map'
import ElementListGrid from 'src/common/ui-kit/components/MapElementList/components/ElementListGrid/ElementListGrid'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useIntl } from 'src/common/react-platform-translation'
import { ButtonLoader } from 'src/common/ui-kit'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { styled } from '@mui/material/styles'
import Toolbar from 'src/common/ui-kit/components/MapElementList/components/Toolbar/Toolbar'
import { isEmpty } from 'lodash'
import EmptyTableMessage from 'src/common/ui-kit/components/Table/EmptyTableMessage'
import { filterListType } from 'src/common/ui-kit/components/MapElementList/components/Filters/FilterButton'

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

/*
 * Type of the function (latLngElementAddressOverride) returns the {lat, lng} object that overrides the default element.address.lat constraints, so that we can get the {lat, lng} object from any elementType that doesn't have the constraint of element.address.lat.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type latLngElementAddressOverrideType<elementType> = (
    element: elementType,
) => // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    lat: number
    // eslint-disable-next-line jsdoc/require-jsdoc
    lng: number
}

/**
 * Constraint type of the id of the elementType, for using it as key props when mapping, or for saving as id when clicking on CardMap with to open its MapInfoWindow.
 */
export type elementIdType = number | string

/**
 * Interface to make sure that generic elementType has at least the id and address with longitude and latitude.
 */
export interface elementConstraintType {
    // eslint-disable-next-line jsdoc/require-jsdoc
    id: elementIdType
}

/**
 * Props Type of MapElementList.
 */
interface IMapElementListProps<elementType, T> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    data: elementType[] | null
    // eslint-disable-next-line jsdoc/require-jsdoc
    header?: JSX.Element
    // eslint-disable-next-line jsdoc/require-jsdoc
    noMoreDataToLoad?: boolean
    // eslint-disable-next-line jsdoc/require-jsdoc
    loadingData: boolean
    // eslint-disable-next-line jsdoc/require-jsdoc
    loadMoreData: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    elementCard: ({ element }: { element: elementType }) => JSX.Element
    // eslint-disable-next-line jsdoc/require-jsdoc
    filters?: filterListType
    // eslint-disable-next-line jsdoc/require-jsdoc
    onConfirmFilter?: (newFilters: T | {}) => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    toolbarSearch?: Boolean
    // eslint-disable-next-line jsdoc/require-jsdoc
    latLngElementAddressOverride?: latLngElementAddressOverrideType<elementType>
}

/**
 * MapElementList view component containing Map & ElementList Items with Filters.
 *
 * @param props N/A.
 * @param props.data Toolbar Below the header with filters.
 * @param props.loadingData Loading Boolean indicating if data is loading.
 * @param props.loadMoreData Handler when clicking on the LoadMoreData.
 * @param props.noMoreDataToLoad Boolean indicating if there is more data to be loaded to show the LoadMore Button.
 * @param props.elementCard Element Card that's going to render the grid List with Cards.
 * @param props.filters Additional elements to place in the Toolbar, usually they are filters (such as given an input Date, to search by date).
 * @param props.onConfirmFilter Function to be called when submit filter.
 * @param props.toolbarSearch Boolean that activates or disactivate search bar on the component toolbar.
 * @param props.latLngElementAddressOverride Represent the {lat, lng} object that overrides the default element.address.lat constraints, so that we can get the {lat, lng} object from any elementType that doesn't have the constraint of element.address.lat.
 * @returns MapElementList component.
 */
function MapElementList<elementType extends elementConstraintType, T>({
    data,
    loadingData,
    loadMoreData,
    noMoreDataToLoad,
    elementCard,
    filters,
    onConfirmFilter,
    toolbarSearch,
    latLngElementAddressOverride,
}: IMapElementListProps<elementType, T>) {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const [mapStylePosition, setMapStylePosition] = useState({ right: 0, top: 0, left: 0 })
    const mdDown = useMediaQuery(theme.breakpoints.down('md'))
    const lgDown = useMediaQuery(theme.breakpoints.down('lg'))
    const listingWrapperRef = useRef<HTMLDivElement>(null)
    const mapEl = useRef<HTMLDivElement>(null)
    const scrollTopButtonRef = useRef<HTMLButtonElement>(null)
    const [showMap, setShowMap] = useState(false)

    /**
     * Toggl the show map checkbox value.
     */
    const handleMapToggle = () => {
        setShowMap((showMap) => !showMap)
        // The fixed map div will start its position (top and right) according to its parent..
        setMapStylePosition({
            top: listingWrapperRef.current!.getBoundingClientRect().y,
            right: window.innerWidth - listingWrapperRef.current!.getBoundingClientRect().right,
            left: listingWrapperRef.current!.getBoundingClientRect().left,
        })
    }
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

    return (
        <Root
            contentToolbar={
                <Toolbar<T>
                    handleMapToggle={handleMapToggle}
                    filterList={filters}
                    onConfirmFilter={onConfirmFilter}
                    toolbarSearch={toolbarSearch}
                />
            }
            content={
                <div className="MapElementList" ref={listingWrapperRef}>
                    {isEmpty(data) && !loadingData ? (
                        <EmptyTableMessage
                            message={formatMessage({
                                id: 'La liste est vide',
                                defaultMessage: 'La liste est vide',
                            })}
                        />
                    ) : (
                        <>
                            {showMap && (
                                <div
                                    className={`MapElementList__Map ${lgDown && 'mb-56'}`}
                                    ref={mapEl}
                                    style={
                                        mdDown
                                            ? { ...mapStylePosition }
                                            : { right: mapStylePosition.right, top: mapStylePosition.top }
                                    }
                                >
                                    <Map<elementType>
                                        latLngElementAddressOverride={latLngElementAddressOverride}
                                        ElementCard={elementCard}
                                        loadingData={loadingData}
                                        data={data}
                                    />
                                </div>
                            )}
                            <div className={showMap ? 'MapElementListWrapperMap' : 'MapElementListWrapper'}>
                                <ElementListGrid<elementType>
                                    data={data}
                                    shrink={showMap}
                                    loadingData={loadingData}
                                    ElementCard={elementCard}
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
                                {noMoreDataToLoad ? (
                                    <></>
                                ) : (
                                    <div className="flex justify-center m-12">
                                        <ButtonLoader
                                            inProgress={loadingData}
                                            type="button"
                                            onClick={(e: SyntheticEvent) => loadMoreData()}
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

export default MapElementList
