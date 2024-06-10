import 'src/modules/MyHouse/MyHouse.scss'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useEffect, useState, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseVariables'
import CircularProgress from '@mui/material/CircularProgress'
import ConnectedPlugsList from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugsList'

/**
 * ConnectedPlugs Page Component used for handling when currentHousing change, or accessing connected Plugs via /:houseId.
 *
 * @returns MyHouse form component.
 */
const ConnectedPlugs = () => {
    const [isCurrentHousingInProgress, setIsCurrentHousingInProgress] = useState(false)
    const { currentHousing, housingList } = useSelector(({ housingModel }: RootState) => housingModel)
    const history = useHistory()
    // initialMount will make sure that Connected Plugs will change only when currentHousing changes when it gets selected.
    // We have two cases:,
    // Case1: If currentHousing didn't change through select, it means where user access the url /../:houseId/connected-plugs
    // Case2: if select currentHousing happens then Connected Plugs should fetch according to new currentHousing
    const initialMount = useRef(true)
    const { houseId } = useParams</**
     *
     */
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        houseId: string
    }>()

    useEffect(() => {
        // This condition makes sure only when select on housing changes currentHousing then Connected Plugs should fetch its data according to the new currentHousing
        // We have two cases,
        // 1. Connected Plugs should be fetched according to houseId from useParams.
        // 2. Select housing, then we should enforce the Connected Plugs to change according to the selected housing, by replacing the url.
        if (!initialMount.current && currentHousing?.id) {
            setIsCurrentHousingInProgress(true)
            history.replace(`${URL_MY_HOUSE}/${currentHousing.id}/connected-plugs`)
        }
    }, [currentHousing?.id, history, houseId])

    useEffect(() => {
        initialMount.current = false
        setIsCurrentHousingInProgress(false)
    }, [houseId])

    // While waiting for houseId on history params change, and making sure that currentHousing & housingList are defined.
    // This enforces Connected Plugs List to have everything ready when its rendered.
    if (isCurrentHousingInProgress || !currentHousing || !housingList)
        return (
            <div className="flex flex-col justify-center items-center w-full h-full" style={{ height: '320px' }}>
                <CircularProgress size={32} />
            </div>
        )

    return <ConnectedPlugsList />
}

export default ConnectedPlugs
