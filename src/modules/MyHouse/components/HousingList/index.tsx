import React from 'react'
import MapElementList from 'src/common/ui-kit/components/MapElementList'
import { useHousingList } from 'src/modules/MyHouse/components/HousingList/HousingListHook'
import HousingCard from 'src/modules/MyHouse/components/HousingList/components/HousingCard'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'

/**
 * HousingList view component containing Map & Housing Items.
 *
 * @returns HousingList page component.
 */
const HousingList = () => {
    const {
        elementList: housingList,
        loadingInProgress: isHousingInProgress,
        loadMoreElements: loadMoreHousings,
        noMoreElementToLoad: noMoreHousingToLoad,
    } = useHousingList(10)

    return (
        <MapElementList<
            IHousing,
            //eslint-disable-next-line
            {}
        >
            data={housingList}
            loadingData={isHousingInProgress}
            loadMoreData={loadMoreHousings}
            elementCard={HousingCard}
            noMoreDataToLoad={noMoreHousingToLoad}
        />
    )
}

export default HousingList
