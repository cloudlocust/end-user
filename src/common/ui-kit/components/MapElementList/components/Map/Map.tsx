import React, { useCallback, useState, useRef } from 'react'
import { GoogleMap, useLoadScript, GoogleMapProps, Marker, MarkerClusterer, InfoWindow } from '@react-google-maps/api'
import { Clusterer } from '@react-google-maps/marker-clusterer'
import ReactLoading from 'react-loading'
import isEmpty from 'lodash/isEmpty'
import MakerImage from 'src/common/ui-kit/components/MapElementList/components/Map/markerImage.png'
import 'src/common/ui-kit/components/MapElementList/MapElementList.scss'
import { useIntl } from 'src/common/react-platform-translation'
import {
    elementConstraintType,
    elementIdType,
    latLngElementAddressOverrideType,
} from 'src/common/ui-kit/components/MapElementList'
import { useSnackbar } from 'notistack'

/*
 * Function to get the default elementType address that have address with {lat: number, lng: number}.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
function getDefaultLatLngFromElementAddresse<elementType>(
    // eslint-disable-next-line jsdoc/require-jsdoc
    element: elementType & { address?: { lat?: number; lng?: number } },
) {
    return {
        lat: element.address!.lat!,
        lng: element.address!.lng!,
    }
}
// eslint-disable-next-line jsdoc/require-jsdoc
type MapWrapperProps = GoogleMapProps & {
    // eslint-disable-next-line jsdoc/require-jsdoc
    children: JSX.Element
}

/**
 * MapWrapper component responsible for loading google map script and returning Google Map Component.
 *
 * @param props N/A.
 * @param props.children JSX Children Wrapped by the GoogleMap Tag.
 * @param props.rest Represent the potential props of GoogleMap Component.
 * @returns .
 */
const MapWrapper = ({ children, ...rest }: MapWrapperProps) => {
    const { isLoaded: isLoadedGoogleMaps, loadError: loadGoogleMapsError } = useLoadScript({
        googleMapsApiKey: 'https://maps.googleapis.com/maps/api/js?v=3.exp&key=&libraries=geometry,drawing,places',
    })
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()

    const MapLoading = (
        <div data-testId="mapDivLoading" className="LoadingMap">
            <ReactLoading type="spin" height={40} width={40} />
        </div>
    )

    if (loadGoogleMapsError)
        enqueueSnackbar(
            formatMessage({
                id: "La Carte n'arrive pas à se charger",
                defaultMessage: "La Carte n'arrive pas à se charger",
            }),
            { variant: 'error' },
        )

    if (isLoadedGoogleMaps) return <GoogleMap {...rest}>{children}</GoogleMap>
    return MapLoading
}

/**
 * ClusteredMarkers component is responsible for display Markers that are already grouped in clusters.
 *
 * @param props N/A.
 * @param props.clusterer The clusterer that contains elements that have location within that cluster.
 * @param props.data Data that is going to be renderer inside the Marker.
 * @param props.ElementCard Element Card that's going to render the grid List with Cards.
 * @param props.latLngElementAddressOverride Represent the {lat, lng} object that overrides the default element.address.lat constraints, so that we can get the {lat, lng} object from any elementType that doesn't have the constraint of element.address.lat.
 * @returns The Elements Within a selected cluster.
 */
function ClusteredMarkers<elementType extends elementConstraintType>(
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        clusterer,
        data,
        ElementCard,
        latLngElementAddressOverride,
    }: // eslint-disable-next-line jsdoc/require-jsdoc
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        clusterer: Clusterer
        // eslint-disable-next-line jsdoc/require-jsdoc
        data: elementType[]
        // eslint-disable-next-line jsdoc/require-jsdoc
        ElementCard: ({ element }: { element: elementType }) => JSX.Element
        // eslint-disable-next-line jsdoc/require-jsdoc
        latLngElementAddressOverride?: latLngElementAddressOverrideType<elementType>
    },
) {
    const [markerIndex, setMarkerIndex] = useState<elementIdType>(0)

    /**.
     * Toggl the marker so that we can zoom in, whether its the cluster or the marker.
     *
     * @param index represent the id of the marker to be focus.
     */
    const infoWindowToggle = (index: elementIdType) => {
        setMarkerIndex(index)
    }
    return (
        <>
            {data.map((element: elementType) => {
                return (
                    <Marker
                        key={element.id}
                        icon={MakerImage}
                        clusterer={clusterer}
                        position={
                            latLngElementAddressOverride
                                ? latLngElementAddressOverride(element)
                                : getDefaultLatLngFromElementAddresse<elementType>(element)
                        }
                        onClick={() => infoWindowToggle(element.id)}
                    >
                        {markerIndex === element.id ? (
                            <InfoWindow
                                position={
                                    latLngElementAddressOverride
                                        ? latLngElementAddressOverride(element)
                                        : getDefaultLatLngFromElementAddresse<elementType>(element)
                                }
                                options={{ pixelOffset: new window.google.maps.Size(0, -100) }}
                                onCloseClick={() => infoWindowToggle(0)}
                            >
                                <div className="MapElementCardWrapper">
                                    <ElementCard element={element} />
                                </div>
                            </InfoWindow>
                        ) : (
                            <></>
                        )}
                    </Marker>
                )
            })}
        </>
    )
}

/**
 * Component that is responsible to render our Map UI, which consists of a list of Markers containing InfoWindow of CustomerCard, and those Markers are grouped by Location Clusters.
 *
 * @param props N/A.
 * @param props.data Represent our items Data.
 * @param props.loadingData Boolean indicating if there is loading Data happening.
 * @param props.ElementCard Element Card that's going to render the grid List with Cards.
 * @param props.latLngElementAddressOverride Represent the {lat, lng} object that overrides the default element.address.lat constraints, so that we can get the {lat, lng} object from any elementType that doesn't have the constraint of element.address.lat.
 * @returns Map Component wrapped in a div.
 */
function Map<elementType extends elementConstraintType>(
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        data,
        loadingData,
        ElementCard,
        latLngElementAddressOverride,
    }: // eslint-disable-next-line jsdoc/require-jsdoc
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        data: elementType[] | null
        // eslint-disable-next-line jsdoc/require-jsdoc
        loadingData: boolean
        // eslint-disable-next-line jsdoc/require-jsdoc
        ElementCard: ({ element }: { element: elementType }) => JSX.Element
        // eslint-disable-next-line jsdoc/require-jsdoc
        latLngElementAddressOverride?: latLngElementAddressOverrideType<elementType>
    },
) {
    // ref will be used for implementation of focus on different cards ...etc.
    const mapRef = useRef<google.maps.Map>()
    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map
    }, [])

    if (data === null || isEmpty(data) || loadingData)
        return (
            <div data-testId="mapDivLoading" className="LoadingMap">
                <ReactLoading type="spin" height={40} width={40} />
            </div>
        )

    return (
        <div data-testId="mapDiv" className="FixedMap">
            <MapWrapper
                id="map-multiple-location"
                zoom={4}
                onLoad={onMapLoad}
                // Lyon France Latitude/Longitude
                center={{
                    lat: 45.764,
                    lng: 4.8357,
                }}
            >
                <MarkerClusterer gridSize={60} averageCenter enableRetinaIcons={true}>
                    {(clusterer) => (
                        <ClusteredMarkers<elementType>
                            latLngElementAddressOverride={latLngElementAddressOverride}
                            ElementCard={ElementCard}
                            clusterer={clusterer}
                            data={data}
                        />
                    )}
                </MarkerClusterer>
            </MapWrapper>
        </div>
    )
}

export default Map
